import { Sidebar } from "@/app/sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="h-screen">
            <Sidebar />
            <div className="min-h-full h-full max-h-full xl:pl-48">
                <main className="flex flex-col min-h-full h-full max-h-full">{children}</main>
            </div>
        </div>
    );
}
