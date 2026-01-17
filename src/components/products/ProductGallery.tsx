"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductImage {
    id: string;
    url: string;
    alt?: string;
    position: number;
}

interface ProductGalleryProps {
    images: ProductImage[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                No images available
            </div>
        );
    }

    const currentImage = images[selectedIndex];

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 group">
                <Image
                    src={currentImage.url}
                    alt={currentImage.alt || productName}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}

                {/* Zoom Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsZoomed(true)}
                >
                    <ZoomIn className="h-5 w-5" />
                </Button>

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "relative aspect-square overflow-hidden rounded-md border-2 transition-all",
                                selectedIndex === index
                                    ? "border-primary"
                                    : "border-transparent hover:border-slate-300"
                            )}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || `${productName} ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Zoom Dialog */}
            <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
                <DialogContent className="max-w-4xl">
                    <div className="relative aspect-square">
                        <Image
                            src={currentImage.url}
                            alt={currentImage.alt || productName}
                            fill
                            className="object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
