import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Project 10K",
    description: "Next Generation Analyst Tool",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} dark:bg-zinc-950`}>
                <div>
                    <Toaster position="top-right" />
                </div>
                {children}
            </body>
        </html>
    );
}
