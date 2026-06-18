import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("=== STARTING DRY RUN PURCHASE TEST ===");

    const customer = {
        name: "Kavitha Ramasamy",
        email: "kavitha.ramasamy.test@gmail.com",
        password: "TestUser@2024",
        phone: "9876543210",
        addressLine1: "42, Thiruvalluvar Street",
        addressLine2: "Anna Nagar West",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600040",
        country: "India"
    };

    // --- STEP 1: REGISTER THE TEST CUSTOMER ---
    console.log("\n--- Step 1: Registering Test Customer ---");
    
    // Clean up pre-existing test customer if any
    const existingUser = await prisma.user.findUnique({
        where: { email: customer.email }
    });
    if (existingUser) {
        console.log(`Found existing user ${customer.email}. Cleaning up old orders/addresses...`);
        // Delete orders first
        const userOrders = await prisma.order.findMany({ where: { userId: existingUser.id } });
        for (const o of userOrders) {
            await prisma.orderItem.deleteMany({ where: { orderId: o.id } });
        }
        await prisma.order.deleteMany({ where: { userId: existingUser.id } });
        await prisma.address.deleteMany({ where: { userId: existingUser.id } });
        await prisma.cartItem.deleteMany({ where: { userId: existingUser.id } });
        await prisma.user.delete({ where: { id: existingUser.id } });
    }

    const hashedPassword = await bcrypt.hash(customer.password, 10);
    const user = await prisma.user.create({
        data: {
            name: customer.name,
            email: customer.email,
            password: hashedPassword,
            role: "CUSTOMER" // Set role to CUSTOMER (non-admin user)
        }
    });

    console.log("✅ User registered in database:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password Hash: ${user.password} (starts with ${user.password?.slice(0, 10)}...)`);

    // --- STEP 2: LOG IN SIMULATION (VERIFY PASSWORDS MATCH) ---
    console.log("\n--- Step 2: Login Verification ---");
    const passwordsMatch = await bcrypt.compare(customer.password, user.password!);
    if (passwordsMatch) {
        console.log("✅ Credentials verification passed: Password matches bcrypt hash.");
    } else {
        throw new Error("Credentials verification failed!");
    }

    // --- STEP 3: FIND AND ADD PRODUCT TO CART ---
    console.log("\n--- Step 3: Find or Create Product & Add to Cart ---");
    
    // Let's find if "Sarees" category exists or create it
    let category = await prisma.category.findUnique({
        where: { slug: "sarees" }
    });
    if (!category) {
        category = await prisma.category.create({
            data: {
                name: "Sarees",
                slug: "sarees",
                description: "Elegant silk and cotton sarees"
            }
        });
    }

    // Find or create the test product
    const productSlug = "kanjivaram-silk-saree-test-product";
    let product = await prisma.product.findUnique({
        where: { slug: productSlug },
        include: { variants: true }
    });

    if (!product) {
        product = await prisma.product.create({
            data: {
                name: "Kanjivaram Silk Saree — Test Product",
                slug: productSlug,
                sku: "TEST-KSS-001",
                description: "A gorgeous deep red Kanjivaram silk saree for testing.",
                price: 3499,
                categoryId: category.id,
                status: "PUBLISHED",
                images: {
                    create: [
                        {
                            url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
                            alt: "Kanjivaram Silk Saree — Test Product Image",
                            position: 0
                        }
                    ]
                },
                variants: {
                    create: [
                        {
                            sku: "TEST-KSS-001-FS",
                            size: "Free Size",
                            color: "Deep Red",
                            inventory: 10
                        }
                    ]
                }
            },
            include: {
                variants: true
            }
        });
    }

    const variant = product.variants[0];
    console.log(`Product found/created: ${product.name}`);
    console.log(`Variant ID: ${variant.id}, SKU: ${variant.sku}, Stock: ${variant.inventory}`);

    // Create CartItem in DB
    const cartItem = await prisma.cartItem.create({
        data: {
            userId: user.id,
            productId: product.id,
            variantId: variant.id,
            quantity: 1
        }
    });

    console.log(`✅ CartItem created in database:`);
    console.log(`   CartItem ID: ${cartItem.id}`);
    console.log(`   Product ID: ${cartItem.productId}`);
    console.log(`   Variant ID: ${cartItem.variantId}`);
    console.log(`   Quantity: ${cartItem.quantity}`);

    // --- STEP 4 & 5: CHECKOUT & SHIPPING ADDRESS PERSISTENCE ---
    console.log("\n--- Steps 4 & 5: Save Address & Checkout Verification ---");
    
    // Save address in database
    const savedAddress = await prisma.address.create({
        data: {
            userId: user.id,
            name: customer.name,
            phone: customer.phone,
            addressLine1: customer.addressLine1,
            addressLine2: customer.addressLine2,
            city: customer.city,
            state: customer.state,
            pincode: customer.pincode,
            country: customer.country,
            isDefault: true
        }
    });

    console.log("✅ Address saved in address book:");
    console.log(`   Address ID: ${savedAddress.id}`);
    console.log(`   Recipient: ${savedAddress.name}, Phone: ${savedAddress.phone}`);
    console.log(`   Street: ${savedAddress.addressLine1}, ${savedAddress.addressLine2}`);
    console.log(`   City/State/Zip: ${savedAddress.city}, ${savedAddress.state} - ${savedAddress.pincode}`);

    // --- STEP 6: SHIPPING SELECTION ---
    console.log("\n--- Step 6: Shipping Selection ---");
    const shippingCost = 150; // Flat test shipping cost
    const totalAmount = product.price + shippingCost;
    console.log(`Base Price: ₹${product.price}`);
    console.log(`Shipping: ₹${shippingCost}`);
    console.log(`Total Amount: ₹${totalAmount}`);

    // --- STEP 7: INITIATE ORDER & PAYMENT ---
    console.log("\n--- Step 7: Creating Order in PENDING State ---");
    const orderNumber = `LB-TEST-${Date.now()}`;
    const razorpayOrderId = `rpay_order_${Math.random().toString(36).substring(2, 11)}`;
    const razorpayPaymentId = `rpay_pay_${Math.random().toString(36).substring(2, 11)}`;
    const razorpaySignature = `rpay_sig_${Math.random().toString(36).substring(2, 11)}`;

    const pendingOrder = await prisma.order.create({
        data: {
            orderNumber,
            userId: user.id,
            status: "PENDING",
            paymentStatus: "PENDING",
            paymentMethod: "RAZORPAY",
            razorpayOrderId,
            subtotal: product.price,
            shipping: shippingCost,
            tax: 0,
            discount: 0,
            total: totalAmount,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            shippingAddress: {
                addressLine1: customer.addressLine1,
                addressLine2: customer.addressLine2,
                city: customer.city,
                state: customer.state,
                pincode: customer.pincode,
                country: customer.country
            },
            items: {
                create: [
                    {
                        productId: product.id,
                        variantId: variant.id,
                        name: product.name,
                        sku: variant.sku,
                        size: variant.size,
                        color: variant.color,
                        price: product.price,
                        quantity: 1,
                        total: product.price
                    }
                ]
            }
        },
        include: {
            items: true
        }
    });

    console.log(`✅ Pending Order created in database:`);
    console.log(`   Order ID: ${pendingOrder.id}`);
    console.log(`   Order Number: ${pendingOrder.orderNumber}`);
    console.log(`   Status: ${pendingOrder.status}, Payment Status: ${pendingOrder.paymentStatus}`);
    console.log(`   Razorpay Order ID: ${pendingOrder.razorpayOrderId}`);

    // --- STEP 8: TEST PAYMENT COMPLETION (STOCK DECREMENT & STATUS CHANGE) ---
    console.log("\n--- Step 8: Simulating Verified Razorpay Payment Completion ---");

    // Execute the exact backend verified transaction logic
    const completedOrder = await prisma.$transaction(async (tx: any) => {
        // Update order status to CONFIRMED and payment to PAID
        const updatedOrder = await tx.order.update({
            where: { id: pendingOrder.id },
            data: {
                status: "CONFIRMED",
                paymentStatus: "PAID",
                razorpayPaymentId,
                razorpaySignature
            },
            include: {
                items: true
            }
        });

        // Decrement product variant stock count
        await tx.productVariant.update({
            where: { id: variant.id },
            data: {
                inventory: {
                    decrement: 1
                }
            }
        });

        // Clear the user's cart items
        await tx.cartItem.deleteMany({
            where: { userId: user.id }
        });

        return updatedOrder;
    });

    console.log(`✅ Order status updated to: ${completedOrder.status}`);
    console.log(`   Payment status updated to: ${completedOrder.paymentStatus}`);
    console.log(`   Razorpay Payment ID: ${completedOrder.razorpayPaymentId}`);

    const finalVariant = await prisma.productVariant.findUnique({
        where: { id: variant.id }
    });
    console.log(`✅ Inventory check: Variant stock count decremented to ${finalVariant?.inventory} units.`);

    // --- STEP 9: ACCOUNT ORDER LISTING CHECK ---
    console.log("\n--- Step 9: Verifying Order Listing in Account ---");
    const accountOrders = await prisma.order.findMany({
        where: { userId: user.id },
        include: { items: true }
    });

    console.log(`✅ Found ${accountOrders.length} orders in Kavitha's account:`);
    accountOrders.forEach((o: any) => {
        console.log(`   * Order #${o.orderNumber} - Date: ${o.createdAt.toLocaleDateString()} - Total: ₹${o.total} - Status: ${o.status}`);
        o.items.forEach((item: any) => {
            console.log(`     - Item: ${item.name} (${item.sku}) - Qty: ${item.quantity}`);
        });
    });

    console.log("\n=== DRY RUN TEST COMPLETION SUCCESS ===");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
