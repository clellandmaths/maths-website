import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clellandmaths.com"),
  title: {
    default: "Clelland Maths | Free Scottish Maths Revision",
    template: "%s | Clelland Maths",
  },
  description: "Free maths revision for Scottish students. Course notes, past papers, video solutions and worksheets for National 5, Higher, Advanced Higher and Applications of Maths.",
  keywords: "clelland maths, national 5 maths, higher maths, advanced higher maths, sqa maths, scottish maths revision, maths past papers",
  // Self-referencing canonical per route — also stops the .pages.dev
  // preview domain competing with the real domain in search results
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    siteName: "Clelland Maths",
    title: "Clelland Maths | Free Scottish Maths Revision",
    description: "Free maths revision for Scottish students — course notes, past papers, video solutions and worksheets.",
    images: [{ url: "/img/logo/clelland-maths-logo.png", width: 836, height: 536, alt: "Clelland Maths" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
