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
    description: "Next Generation Analyst Tool",
};

function Aside() {
    return (
        <aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-0 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
            <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <h2 className="text-base font-semibold leading-7 text-white">Activity feed</h2>
                <a href="#" className="text-sm font-semibold leading-6 text-indigo-400">
                    View all
                </a>
            </header>
            <ul role="list" className="divide-y divide-white/5">
                {activityItems.map((item) => (
                    <li key={item.commit} className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-x-3">
                            <img alt="" src={item.user.imageUrl} className="h-6 w-6 flex-none rounded-full bg-gray-800" />
                            <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-white">{item.user.name}</h3>
                            <time dateTime={item.dateTime} className="flex-none text-xs text-gray-600">
                                {item.date}
                            </time>
                        </div>
                        <p className="mt-3 truncate text-sm text-gray-500">
                            Pushed to <span className="text-gray-400">{item.projectName}</span> (
                            <span className="font-mono text-gray-400">{item.commit}</span> on{' '}
                            <span className="text-gray-400">{item.branch}</span>)
                        </p>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Sidebar />
            <div className="xl:pl-72">
                <main className="lg:pr-96">
                    {children}
                </main>
                <Aside />
            </div>
        </>
    );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="dark min-h-screen w-full bg-zinc-950">
                    <Layout>
                        {children}
                    </Layout>
                </div>
            </body>
        </html>
    );
}