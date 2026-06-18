import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("=== Running Admin CRUD Flow Verification ===");

    const categorySlug = "lehengas";
    const category = await prisma.category.findUnique({
        where: { slug: categorySlug }
    });

    if (!category) {
        console.error(`Category ${categorySlug} not found in database.`);
        return;
    }

    const testSlug = "test-luxury-silk-lehenga";
    const testSku = "LBL-TEST-LEH-100";

    // 1. ADD PRODUCT
    console.log("\n--- Step 1: Adding a product ---");
    
    // Ensure clean state before starting
    const existing = await prisma.product.findUnique({ where: { slug: testSlug } });
    if (existing) {
        console.log("Found pre-existing test product. Deleting it to start fresh...");
        await prisma.product.delete({ where: { slug: testSlug } });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                name: "Test Luxury Silk Lehenga",
                slug: testSlug,
                sku: testSku,
                description: "A premium handwoven silk lehenga with exquisite gold zari work.",
                price: 15999,
                categoryId: category.id,
                status: "PUBLISHED",
                images: {
                    create: [
                        {
                            url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
                            alt: "Test Luxury Silk Lehenga Image",
                            position: 0
                        }
                    ]
                },
                variants: {
                    create: [
                        {
                            sku: `${testSku}-S`,
                            size: "S",
                            color: "Royal Red",
                            inventory: 5
                        },
                        {
                            sku: `${testSku}-M`,
                            size: "M",
                            color: "Royal Red",
                            inventory: 10
                        },
                        {
                            sku: `${testSku}-L`,
                            size: "L",
                            color: "Royal Red",
                            inventory: 8
                        }
                    ]
                }
            },
            include: {
                images: true,
                variants: true
            }
        });

        console.log(`✅ Product created successfully!`);
        console.log(`   ID: ${newProduct.id}`);
        console.log(`   Price: ₹${newProduct.price}`);
        console.log(`   Images Count: ${newProduct.images.length} (First Image URL: ${newProduct.images[0].url})`);
        console.log(`   Variants Count: ${newProduct.variants.length}`);
        newProduct.variants.forEach((v: any) => {
            console.log(`     * Variant: ${v.size} / ${v.color} - Stock: ${v.inventory} - SKU: ${v.sku}`);
        });

        const createdProductId = newProduct.id;

        // 2. EDIT PRODUCT DETAILS
        console.log("\n--- Step 2: Editing the product ---");
        // Simulate edit: update price, change description, update variant stock levels, update image URL.
        const updatedProduct = await prisma.$transaction(async (tx: any) => {
            // Update core fields
            await tx.product.update({
                where: { id: createdProductId },
                data: {
                    price: 17999, // Updated price
                    description: "Updated: A premium handwoven silk lehenga with exquisite gold zari work and matching dupatta."
                }
            });

            // Update images (delete and recreate)
            await tx.productImage.deleteMany({
                where: { productId: createdProductId }
            });
            await tx.productImage.createMany({
                data: [
                    {
                        productId: createdProductId,
                        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", // New image URL
                        alt: "Updated Luxury Silk Lehenga Image",
                        position: 0
                    }
                ]
            });

            // Update variants (delete and recreate)
            await tx.productVariant.deleteMany({
                where: { productId: createdProductId }
            });
            await tx.productVariant.createMany({
                data: [
                    {
                        productId: createdProductId,
                        sku: `${testSku}-S-NEW`,
                        size: "S",
                        color: "Royal Red",
                        inventory: 12 // Increased stock
                    },
                    {
                        productId: createdProductId,
                        sku: `${testSku}-M-NEW`,
                        size: "M",
                        color: "Royal Red",
                        inventory: 15 // Increased stock
                    },
                    {
                        productId: createdProductId,
                        sku: `${testSku}-L-NEW`,
                        size: "L",
                        color: "Royal Red",
                        inventory: 20 // Increased stock
                    },
                    {
                        productId: createdProductId,
                        sku: `${testSku}-XL-NEW`,
                        size: "XL", // Added XL variant
                        color: "Royal Red",
                        inventory: 10
                    }
                ]
            });

            // Fetch the updated product
            return await tx.product.findUnique({
                where: { id: createdProductId },
                include: {
                    images: true,
                    variants: true
                }
            });
        });

        if (!updatedProduct) {
            throw new Error("Failed to retrieve updated product.");
        }

        console.log(`✅ Product updated successfully!`);
        console.log(`   Updated Price: ₹${updatedProduct.price}`);
        console.log(`   Updated Description: "${updatedProduct.description}"`);
        console.log(`   Updated Images Count: ${updatedProduct.images.length} (New Image URL: ${updatedProduct.images[0].url})`);
        console.log(`   Updated Variants Count: ${updatedProduct.variants.length}`);
        updatedProduct.variants.forEach((v: any) => {
            console.log(`     * Variant: ${v.size} / ${v.color} - Stock: ${v.inventory} - SKU: ${v.sku}`);
        });

        // 3. DELETE PRODUCT
        console.log("\n--- Step 3: Deleting the product ---");
        await prisma.product.delete({
            where: { id: createdProductId }
        });

        // Verify deletion
        const deletedCheck = await prisma.product.findUnique({
            where: { id: createdProductId }
        });

        if (!deletedCheck) {
            console.log("✅ Product deleted successfully!");
        } else {
            console.error("❌ FAILED: Product still exists after delete operation.");
        }

    } catch (err) {
        console.error("Error during CRUD operations:", err);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
