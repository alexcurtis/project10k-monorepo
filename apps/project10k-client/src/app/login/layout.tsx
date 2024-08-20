export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="h-screen">
            <div className="min-h-full h-full max-h-full">
                <main className="flex flex-col min-h-full h-full max-h-full">{children}</main>
            </div>
        </div>
    );
}
