import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { themeBootstrapScript } from "@/components/ThemeToggle";

export const metadata: Metadata = {
    title: "TeenUp Mini LMS",
    description: "Quản lý học sinh, lớp học và gói học",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="vi" className="h-full antialiased" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
                />
            </head>
            <body className="min-h-full">
                <AppShell>{children}</AppShell>
            </body>
        </html>
    );
}
