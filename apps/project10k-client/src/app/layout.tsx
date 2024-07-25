import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Sidebar } from './sidebar';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const activityItems = [
    {
        user: {
            name: 'Michael Foster',
            imageUrl:
                'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        projectName: 'ios-app',
        commit: '2d89f0c8',
        branch: 'main',
        date: '1h',
        dateTime: '2023-01-23T11:00',
    },
    // More items...
]

export const metadata: Metadata = {
    title: "Project 10K",
    description: "Next Generation Analyst Tool"
};

function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Sidebar />
            <div className="min-h-full h-full max-h-full xl:pl-48">
                <main className="flex flex-col min-h-full h-full max-h-full">
                    {children}
                </main>
            </div>
        </>
    );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className="min-h-full h-full max-h-full">
            <body className={`min-h-full h-full max-h-full ${inter.className}`}>
                <div className="dark min-h-full h-full max-h-full w-full bg-zinc-950">
                    <Layout>
                        {children}
                    </Layout>
                </div>
            </body>
        </html>
    );
}