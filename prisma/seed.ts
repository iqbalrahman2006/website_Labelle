import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES_DATA = [
    {
        name: "Salwar Suits",
        slug: "salwar-suits",
        description: "Trendy and traditional salwar kameez sets, Patiala suits, and straight cuts.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        count: 15,
        priceMin: 1499,
        priceMax: 5999,
        fabrics: ["Cotton", "Silk", "Georgette", "Chanderi"],
        occasions: ["Festive Wear", "Casual Wear", "Office Wear"],
        sleeveTypes: ["Three-Quarter", "Full Sleeves", "Sleeveless"],
        patterns: ["Floral Print", "Embroidered", "Solid with Gota Patti", "Anarkali Cut"]
    },
    {
        name: "Anarkali Suits",
        slug: "anarkali-suits",
        description: "Regal and floor-sweeping flared suits for special celebrations.",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
        count: 12,
        priceMin: 2999,
        priceMax: 8999,
        fabrics: ["Georgette", "Silk Blend", "Velvet", "Net"],
        occasions: ["Weddings", "Festive Wear", "Evening Party"],
        sleeveTypes: ["Full Sleeves", "Three-Quarter", "Elbow Length"],
        patterns: ["Zari Embroidery", "Sequined Work", "Block Printed", "Mirror Work"]
    },
    {
        name: "Kurtis",
        slug: "kurtis",
        description: "Stylish everyday and semi-formal tunics for women.",
        image: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80",
        count: 15,
        priceMin: 799,
        priceMax: 3499,
        fabrics: ["Rayon", "Pure Cotton", "Linen", "Crepe"],
        occasions: ["Daily Wear", "Office Wear", "Casual Outing"],
        sleeveTypes: ["Three-Quarter", "Short Sleeves", "Sleeveless"],
        patterns: ["Solid Dyed", "Jaipuri Block Print", "A-line Striped", "Chikankari Work"]
    },
    {
        name: "Sarees",
        slug: "sarees",
        description: "Exquisite 6-yard drapes representing traditional Indian heritage.",
        image: "https://images.unsplash.com/photo-1583391265517-35bbdba01229?auto=format&fit=crop&w=600&q=80",
        count: 12,
        priceMin: 1999,
        priceMax: 12999,
        fabrics: ["Banarasi Silk", "Organza", "Chiffon", "Kanjeevaram Silk"],
        occasions: ["Weddings", "Festive Celebrations", "Rituals"],
        sleeveTypes: ["Unstitched Blouse", "Stitched Half Sleeve", "Sleeveless Blouse"],
        patterns: ["Zari Border", "Floral Weave", "Leheriya", "Bandhani Print"]
    },
    {
        name: "Lehengas",
        slug: "lehengas",
        description: "Opulent lehenga cholis with matching dupattas for brides and bridesmaids.",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
        count: 10,
        priceMin: 4999,
        priceMax: 24999,
        fabrics: ["Silk Velvet", "Raw Silk", "Net", "Organza"],
        occasions: ["Bridal Wear", "Weddings", "Sangeet Night"],
        sleeveTypes: ["Short Sleeves", "Elbow Length", "Sleeveless"],
        patterns: ["Zardosi Embroidery", "Sequins and Dori Work", "Gota Patti", "Floral Digital Print"]
    },
    {
        name: "Kids Ethnic Wear",
        slug: "kids-ethnic-wear",
        description: "Charming traditional dresses for kids under 7 years old.",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80",
        count: 15,
        priceMin: 599,
        priceMax: 2999,
        fabrics: ["Soft Cotton", "Silk Blend", "Rayon", "Net (Soft Lining)"],
        occasions: ["Festivals", "Birthdays", "Family Weddings"],
        sleeveTypes: ["Short Sleeves", "Three-Quarter", "Sleeveless"],
        patterns: ["Cute Floral Print", "Lehenga Kurti Set", "Boys Kurta Pyjama", "Gharara Set"]
    },
    {
        name: "Palazzo Sets",
        slug: "palazzo-sets",
        description: "Modern flare pants paired with elegant matching kurtas.",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
        count: 10,
        priceMin: 1299,
        priceMax: 4499,
        fabrics: ["Rayon Slub", "Cotton Flex", "Georgette", "Linen"],
        occasions: ["Casual Wear", "Festive Semi-Formal", "Social Gatherings"],
        sleeveTypes: ["Three-Quarter", "Strap Sleeveless", "Bell Sleeves"],
        patterns: ["Solid Kurta with Printed Palazzo", "Gold Foil Prints", "Striped Co-ord", "Embroidered Neck"]
    },
    {
        name: "Dupatta & Accessories",
        slug: "dupatta-accessories",
        description: "Traditional dupattas, stoles, and ethnic jewelry to complete your look.",
        image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80",
        count: 11,
        priceMin: 399,
        priceMax: 2499,
        fabrics: ["Phulkari Cotton", "Banarasi Silk", "Chiffon", "Net"],
        occasions: ["Mix & Match", "Festive Enhancer", "Gift Items"],
        sleeveTypes: ["N/A"],
        patterns: ["Heavy Thread Work", "Brocade Borders", "Bandhani Dye", "Tassel Hangings"]
    }
];

// Helper to generate a friendly product name
function generateProductName(categoryName: string, pattern: string, fabric: string, index: number): string {
    const prefixes = ["Royal", "Elegant", "Classic", "Vibrant", "Mystic", "Heritage", "Sovereign", "Adorned", "Exquisite", "Traditional"];
    const prefix = prefixes[index % prefixes.length];
    
    // Custom names for kids
    if (categoryName === "Kids Ethnic Wear") {
        const kidsAdjectives = ["Little Star", "Tiny Princess", "Mini Prince", "Charming", "Adorable", "Playful"];
        const kidsAdj = kidsAdjectives[index % kidsAdjectives.length];
        if (index % 2 === 0) {
            return `${prefix} ${kidsAdj} ${fabric} Lehenga Set (Under 7)`;
        } else {
            return `${prefix} ${kidsAdj} ${fabric} Kurta Pyjama (Under 7)`;
        }
    }
    
    if (categoryName === "Dupatta & Accessories") {
        const accTypes = ["Dupatta", "Stole", "Shawl", "Jhumka Set", "Potli Bag"];
        const type = accTypes[index % accTypes.length];
        return `${prefix} ${fabric} ${pattern} ${type}`;
    }

    return `${prefix} ${fabric} ${pattern} ${categoryName.replace(/s$/, '')}`;
}

async function main() {
    console.log('Starting full enterprise database seeding...');

    // 1. Create or update Admin User
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@labelle.com' },
        update: {
            password: adminPassword,
            role: Role.ADMIN,
        },
        create: {
            email: 'admin@labelle.com',
            name: 'Master Admin',
            password: adminPassword,
            role: Role.ADMIN,
        },
    });
    console.log('Admin User Verified:', admin.email);

    // 2. Clear old data to avoid unique constraint issues
    console.log('Cleaning existing database content...');
    await prisma.productVariant.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    console.log('Database cleaned successfully.');

    // 3. Seed Categories & Products
    let totalProductsSeeded = 0;

    for (const cat of CATEGORIES_DATA) {
        console.log(`Creating Category: ${cat.name}...`);
        
        const category = await prisma.category.create({
            data: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                image: cat.image,
                isActive: true,
                displayOrder: CATEGORIES_DATA.indexOf(cat),
                metaTitle: `Shop Premium ${cat.name} Online | LaBelle Indian Fashions`,
                metaDesc: `Browse exclusive designer ${cat.name}. Pure fabrics, custom fittings, shipping worldwide. Shop now!`
            }
        });

        // Create the specified number of products for this category
        for (let i = 0; i < cat.count; i++) {
            const fabric = cat.fabrics[i % cat.fabrics.length];
            const occasion = [cat.occasions[i % cat.occasions.length]];
            const sleeveType = cat.sleeveTypes[i % cat.sleeveTypes.length];
            const pattern = cat.patterns[i % cat.patterns.length];

            const name = generateProductName(cat.name, pattern, fabric, i);
            const slug = `${cat.slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`;
            const sku = `${cat.slug.slice(0, 3).toUpperCase()}-${fabric.slice(0, 3).toUpperCase()}-${100 + i}`;

            // Calculate realistic prices in INR (₹)
            const price = Math.round((cat.priceMin + (cat.priceMax - cat.priceMin) * (i / cat.count)) / 10) * 10 + 9; // e.g. 1499, 1599, etc.
            const compareAtPrice = Math.round((price * 1.3) / 100) * 100 - 1; // 30% higher, ending in 99

            // Flags
            const isFeatured = i === 0 || i === 4;
            const isNewArrival = i % 3 === 0;
            const isBestseller = i % 4 === 1;

            // Description
            const description = `Indulge in the luxury of traditional Indian couture with this exquisite ${name}. Crafted from premium ${fabric} fabric, it features intricate ${pattern} that showcases the rich artistic heritage of Indian weavers. Perfect for ${occasion[0].toLowerCase()}, it offers a comfortable fit with ${sleeveType} and a elegant silhouette. Pair it with matching accessories to complete a jaw-dropping look.\n\nFabric & Care:\n- Material: ${fabric}\n- Wash Care: Dry Clean Recommended\n- Origin: Handcrafted in India`;

            const product = await prisma.product.create({
                data: {
                    name,
                    slug,
                    sku,
                    description,
                    shortDesc: `Luxury ${fabric} ${cat.name.toLowerCase()} with ${pattern} detail.`,
                    categoryId: category.id,
                    price,
                    compareAtPrice,
                    inventory: 30 + (i * 5),
                    status: ProductStatus.PUBLISHED,
                    fabric,
                    care: "Dry Clean Only. Steam iron on reverse side.",
                    occasion,
                    pattern,
                    sleeveType,
                    isFeatured,
                    isNewArrival,
                    isBestseller,
                    averageRating: 4.0 + (i % 10) * 0.1,
                    reviewCount: 5 + (i * 3),
                    metaTitle: `${name} | LaBelle Indian Fashions`,
                    metaDesc: `Buy ${name} at best prices. Premium ${fabric} ethnic wear with custom options. Fast worldwide shipping.`,
                }
            });

            // Create 1 product image using the category's stock Unsplash image
            await prisma.productImage.create({
                data: {
                    productId: product.id,
                    url: cat.image,
                    alt: name,
                    position: 0
                }
            });

            // Create Variants (Sizes: S, M, L, XL for adults; 2-3Y, 4-5Y, 6-7Y for Kids)
            const sizes = cat.slug === "kids-ethnic-wear" ? ["2-3Y", "4-5Y", "6-7Y"] : ["S", "M", "L", "XL"];
            const colors = ["Deep Maroon", "Rose Gold", "Royal Emerald", "Midnight Indigo", "Mustard Yellow"];
            const selectedColor = colors[i % colors.length];

            for (const size of sizes) {
                await prisma.productVariant.create({
                    data: {
                        productId: product.id,
                        sku: `${sku}-${size}`,
                        size,
                        color: selectedColor,
                        inventory: 10 + (i % 3) * 5,
                        isActive: true
                    }
                });
            }

            totalProductsSeeded++;
        }
    }

    console.log(`Database seeding completed! Successfully seeded ${totalProductsSeeded} products.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
