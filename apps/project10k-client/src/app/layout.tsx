import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloAppProvider } from "@/app/graphql";
import { Sidebar } from "./sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Project 10K",
    description: "Next Generation Analyst Tool",
};

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Sidebar />
            <div className="min-h-full h-full max-h-full xl:pl-48">
                <main className="flex flex-col min-h-full h-full max-h-full">{children}</main>
            </div>
        </>
    );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark min-h-full h-full max-h-full">
            <body className={`min-h-full h-full max-h-full ${inter.className}`}>
                <div className="min-h-full h-full max-h-full w-full dark:bg-zinc-950">
                    <Layout>{children}</Layout>
                </div>
            </body>
        </html>
    );
}
