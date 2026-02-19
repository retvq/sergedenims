import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serge De Nimes | Design Request",
  description: "Submit your custom denim design ideas for review",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
