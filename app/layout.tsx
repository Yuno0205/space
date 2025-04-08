import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geist = Geist({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Personal Workspace",
  description: "Your personal space for blogging and English learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow bg-white dark:bg-gray-900">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
