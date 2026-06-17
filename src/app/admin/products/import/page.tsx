"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Papa from "papaparse";
import { 
    ArrowLeft, 
    Upload, 
    FileText, 
    CheckCircle, 
    AlertCircle, 
    Download, 
    RefreshCw,
    Info,
    HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/formatters";

interface ImportVariant {
    size: string;
    color: string;
    stock: number;
    priceAdjustment: number;
}

interface ImportProduct {
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    categoryName: string;
    fabric: string | null;
    care: string | null;
    pattern: string | null;
    sleeveType: string | null;
    images: string[];
    variants: ImportVariant[];
}

export default function ProductImportPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [parsedProducts, setParsedProducts] = useState<ImportProduct[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // CSV headers list for documentation
    const expectedHeaders = [
        "name", "slug", "description", "price", "compareAtPrice", 
        "categoryName", "fabric", "care", "pattern", "sleeveType", 
        "images", "size", "color", "stock", "priceAdjustment"
    ];

    // Function to download sample CSV template dynamically
    const handleDownloadTemplate = () => {
        const headers = expectedHeaders.join(",");
        const rows = [
            `Banarasi Silk Kanjeevaram Saree,,Luxurious handwoven Banarasi silk saree with traditional gold zari borders,18500,24000,Sarees,Banarasi Silk,Dry Clean Only,Zari Brocade,,https://images.unsplash.com/photo-1610030469983-98e550d6193c,S,Royal Blue,10,0`,
            `Banarasi Silk Kanjeevaram Saree,,Luxurious handwoven Banarasi silk saree with traditional gold zari borders,18500,24000,Sarees,Banarasi Silk,Dry Clean Only,Zari Brocade,,https://images.unsplash.com/photo-1610030469983-98e550d6193c,M,Royal Blue,15,0`,
            `Banarasi Silk Kanjeevaram Saree,,Luxurious handwoven Banarasi silk saree with traditional gold zari borders,18500,24000,Sarees,Banarasi Silk,Dry Clean Only,Zari Brocade,,https://images.unsplash.com/photo-1610030469983-98e550d6193c,L,Royal Blue,10,250`,
            `Kids Chanderi Lehenga Set,,Traditional gold embroidered Chanderi lehenga set for girls,4500,6000,Kids Ethnic Wear,Chanderi Cotton,Dry Clean Only,Embroidered,,https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b,2-3Y,Gold Cream,5,0`,
            `Kids Chanderi Lehenga Set,,Traditional gold embroidered Chanderi lehenga set for girls,4500,6000,Kids Ethnic Wear,Chanderi Cotton,Dry Clean Only,Embroidered,,https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b,4-5Y,Gold Cream,8,0`,
            `Kids Chanderi Lehenga Set,,Traditional gold embroidered Chanderi lehenga set for girls,4500,6000,Kids Ethnic Wear,Chanderi Cotton,Dry Clean Only,Embroidered,,https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b,6-7Y,Gold Cream,5,100`
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "labelle_product_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV template downloaded!");
    };

    // Client side parser
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        const selectedFile = files[0];
        if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
            toast.error("Please upload a valid CSV file.");
            return;
        }

        setFile(selectedFile);
        setErrorMsg(null);
        setIsParsing(true);

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setIsParsing(false);
                if (results.errors.length > 0) {
                    console.error("PapaParse errors:", results.errors);
                    setErrorMsg("CSV parsing failed. Please verify that the file layout matches the standard.");
                    return;
                }

                const rows = results.data as any[];
                if (rows.length === 0) {
                    setErrorMsg("CSV file is empty.");
                    return;
                }

                // Verify headers
                const fileHeaders = Object.keys(rows[0]);
                const requiredHeaders = ["name", "description", "price", "categoryName", "size", "color", "stock"];
                const missingHeaders = requiredHeaders.filter(h => !fileHeaders.includes(h));

                if (missingHeaders.length > 0) {
                    setErrorMsg(`Missing required CSV columns: ${missingHeaders.join(", ")}`);
                    return;
                }

                // Group variants by product slug
                const productMap = new Map<string, ImportProduct>();

                for (let idx = 0; idx < rows.length; idx++) {
                    const row = rows[idx];
                    const name = row.name?.trim();
                    if (!name) continue; // skip rows without name

                    const slug = row.slug?.trim() ? slugify(row.slug) : slugify(name);
                    const size = row.size?.trim().toUpperCase();
                    const color = row.color?.trim();

                    if (!size || !color) continue; // skip invalid variant rows

                    const price = parseFloat(row.price);
                    const compareAtPrice = row.compareAtPrice ? parseFloat(row.compareAtPrice) : null;
                    const stock = parseInt(row.stock) || 0;
                    const priceAdjustment = parseFloat(row.priceAdjustment) || 0;

                    const variant: ImportVariant = {
                        size,
                        color,
                        stock,
                        priceAdjustment
                    };

                    if (productMap.has(slug)) {
                        const existingProduct = productMap.get(slug)!;
                        // Add variant to existing product
                        existingProduct.variants.push(variant);
                    } else {
                        // Create a new product entry
                        const imageList = row.images 
                            ? row.images.split(",").map((url: string) => url.trim()).filter((url: string) => url !== "")
                            : [];

                        const newProduct: ImportProduct = {
                            name,
                            slug,
                            description: row.description || "",
                            price: isNaN(price) ? 0 : price,
                            compareAtPrice: isNaN(Number(compareAtPrice)) ? null : compareAtPrice,
                            categoryName: row.categoryName || "Uncategorized",
                            fabric: row.fabric || null,
                            care: row.care || null,
                            pattern: row.pattern || null,
                            sleeveType: row.sleeveType || null,
                            images: imageList,
                            variants: [variant]
                        };

                        productMap.set(slug, newProduct);
                    }
                }

                const finalProducts = Array.from(productMap.values());
                if (finalProducts.length === 0) {
                    setErrorMsg("Could not parse any valid products/variants from CSV.");
                } else {
                    setParsedProducts(finalProducts);
                    toast.success(`Parsed ${finalProducts.length} products with variants from CSV.`);
                }
            },
            error: (err) => {
                setIsParsing(false);
                console.error("CSV parse error:", err);
                setErrorMsg(`CSV file parsing error: ${err.message}`);
            }
        });
    };

    // Submits the payload to the server
    const handleImportSubmit = async () => {
        if (parsedProducts.length === 0) return;

        setIsImporting(true);
        try {
            const response = await fetch("/api/products/bulk-import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(parsedProducts)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to import products");
            }

            toast.success(`Successfully imported ${result.productsCount} products!`);
            router.push("/admin/products");
            router.refresh();
        } catch (err: any) {
            console.error("Import submit error:", err);
            setErrorMsg(err.message || "Bulk import failed. Please check connection and try again.");
            toast.error(err.message || "Import failed");
        } finally {
            setIsImporting(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setParsedProducts([]);
        setErrorMsg(null);
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto px-4 py-6">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="sm" type="button" className="hover:bg-accent hover:text-accent-foreground">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Catalog
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gold-gradient font-serif">
                            Bulk Import Products
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Populate the store inventory atomically using a standard CSV file.
                        </p>
                    </div>
                </div>
                
                <Button 
                    variant="outline" 
                    onClick={handleDownloadTemplate}
                    className="border-primary/40 text-primary hover:bg-primary/5 shadow-sm"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV Template
                </Button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg flex items-start gap-3 text-sm font-medium">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p>{errorMsg}</p>
                        <p className="text-xs opacity-80 mt-1">
                            Verify that your CSV header names match exactly (case-sensitive) and contain valid sizes (S, M, L, XL, XXL, XXXL, 2-3Y, 4-5Y, 6-7Y).
                        </p>
                    </div>
                </div>
            )}

            {parsedProducts.length === 0 ? (
                /* Import Zone Card */
                <Card className="glass-card max-w-3xl mx-auto py-10 shadow-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-serif text-primary">Upload Catalog CSV File</CardTitle>
                        <CardDescription>Drag and drop or select your CSV spreadsheet to parse product catalog listings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border-2 border-dashed border-border/80 hover:border-primary/40 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative group">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isParsing}
                            />
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-slate-800 text-sm">
                                        {isParsing ? "Parsing CSV File..." : "Drag & Drop CSV File here"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        or click to browse from local computer
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CSV Specifications Documentation */}
                        <div className="bg-muted/40 rounded-lg p-5 border border-border/40">
                            <h3 className="font-serif font-semibold text-primary text-sm mb-3 flex items-center gap-2">
                                <Info className="h-4 w-4 stroke-1.5" />
                                Import CSV Structure & Rules
                            </h3>
                            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
                                <li>
                                    <strong>Grouping Rows:</strong> Multiple rows with the same product name/slug will be grouped automatically as variants of that product.
                                </li>
                                <li>
                                    <strong>Required Fields:</strong> <code>name</code>, <code>description</code>, <code>price</code>, <code>categoryName</code>, <code>size</code>, <code>color</code>, <code>stock</code>.
                                </li>
                                <li>
                                    <strong>Valid Sizes:</strong> Adult (<code>S, M, L, XL, XXL, XXXL</code>), Kids (<code>2-3Y, 4-5Y, 6-7Y</code>).
                                </li>
                                <li>
                                    <strong>Multiple Image URLs:</strong> Comma-separated links in the <code>images</code> column.
                                </li>
                                <li>
                                    <strong>INR Pricing:</strong> Prices should be numeric integers or decimals (formatted in INR natively on the database).
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* CSV Preview Table Card */
                <Card className="glass-card shadow-md">
                    <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
                        <div>
                            <CardTitle className="text-2xl font-serif text-primary">Catalog Import Preview</CardTitle>
                            <CardDescription>
                                Verified {parsedProducts.length} unique products from file: <strong className="text-slate-800">{file?.name}</strong>
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleReset} disabled={isImporting}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                            <Button 
                                onClick={handleImportSubmit} 
                                disabled={isImporting}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isImporting ? "Importing Data..." : "Confirm & Import Catalog"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Base Price</TableHead>
                                        <TableHead>Specifications</TableHead>
                                        <TableHead>Size & Color Variants (Stock)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedProducts.map((p, idx) => (
                                        <TableRow key={idx} className="hover:bg-muted/10">
                                            <TableCell>
                                                {p.images[0] ? (
                                                    <img 
                                                        src={p.images[0]} 
                                                        alt={p.name}
                                                        className="h-12 w-12 object-cover rounded border border-border"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=150&auto=format&fit=crop";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center text-[10px] text-muted-foreground border">
                                                        No Image
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="font-semibold text-slate-800">{p.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono">slug: {p.slug}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-medium bg-secondary/15 text-secondary border-secondary/20">
                                                    {p.categoryName}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-slate-900">{formatCurrency(p.price)}</div>
                                                {p.compareAtPrice && (
                                                    <div className="text-xs text-muted-foreground line-through">{formatCurrency(p.compareAtPrice)}</div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs space-y-1">
                                                {p.fabric && <div><span className="text-muted-foreground font-medium">Fabric:</span> {p.fabric}</div>}
                                                {p.pattern && <div><span className="text-muted-foreground font-medium">Pattern:</span> {p.pattern}</div>}
                                                {p.sleeveType && <div><span className="text-muted-foreground font-medium">Sleeve:</span> {p.sleeveType}</div>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1.5 max-w-[400px]">
                                                    {p.variants.map((v, vIdx) => (
                                                        <span 
                                                            key={vIdx} 
                                                            className="inline-flex items-center text-[11px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-medium"
                                                        >
                                                            {v.size} / {v.color} 
                                                            <span className="text-primary font-bold ml-1">({v.stock})</span>
                                                            {v.priceAdjustment > 0 && (
                                                                <span className="text-emerald-600 font-bold ml-1">
                                                                    +₹{v.priceAdjustment}
                                                                </span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
