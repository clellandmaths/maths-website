import type { Metadata, Viewport } from "next";
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
  description: "Free maths revision for Scottish students: course notes, past papers and video solutions for National 5, Higher, Advanced Higher and Applications of Maths.",
  // Both names on purpose. Pupils search "SQA" today and will increasingly
  // search "Qualifications Scotland" and "QS maths" as the rename beds in, so
  // we want to be found either way rather than betting on one.
  keywords: "clelland maths, national 5 maths, higher maths, advanced higher maths, sqa maths, sqa past papers, qualifications scotland maths, qualifications scotland past papers, qs maths, scottish maths revision, maths past papers",
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
  manifest: "/site.webmanifest",
};

// Next 16 wants themeColor here rather than in metadata; in metadata it is
// silently dropped, and the Android browser chrome stays white above a dark
// page.
export const viewport: Viewport = {
  themeColor: "#0a0e17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        {/* Structured data. Tells Google this is one organisation running an
            education site, which is what earns the sitelinks and the logo in
            search results — neither of which it will infer from prose. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'EducationalOrganization',
                  '@id': 'https://clellandmaths.com/#org',
                  name: 'Clelland Maths',
                  url: 'https://clellandmaths.com',
                  logo: 'https://clellandmaths.com/img/logo/clelland-maths-logo.png',
                  description:
                    'Free maths revision for Scottish students, run by a serving Scottish maths teacher.',
                  areaServed: { '@type': 'Country', name: 'Scotland' },
                  sameAs: [
                    'https://www.youtube.com/clellandmaths',
                    'https://www.tiktok.com/@clellandmaths',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://clellandmaths.com/#website',
                  url: 'https://clellandmaths.com',
                  name: 'Clelland Maths',
                  publisher: { '@id': 'https://clellandmaths.com/#org' },
                  inLanguage: 'en-GB',
                },
              ],
            }),
          }}
        />
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
