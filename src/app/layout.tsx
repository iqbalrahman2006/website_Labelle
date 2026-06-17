import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
});

export const metadata: Metadata = {
    title: "LaBelle Indian Fashions",
    description: "Premium Exclusive Indian Ethnic Wear for Women and Kids under 7",
};

import { Providers } from "@/components/common/providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body className="font-sans antialiased bg-background text-foreground">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
