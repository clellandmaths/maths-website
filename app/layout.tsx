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
    /* **`data-theme`, not `className="dark"`.**

       The class was Tailwind's dark-variant switch and nothing read it: there
       was not one `dark:` utility in the codebase, and `:root` simply WAS the
       dark palette. The attribute is what `globals.css` and its
       `@custom-variant` both key off now, and it is server-rendered, so the
       first paint is already the right theme rather than one corrected a frame
       later.

       **Stamped `dark` here on purpose, for now.** 665 colour literals still
       name slate directly and never reach a token, so a page resolving to light
       today would be half converted. This attribute is the last thing the
       light-mode work changes: when the literals are gone it comes off and the
       palette's `prefers-color-scheme` block answers for anyone who has not
       chosen. See docs/light-mode.md. */
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        {/* **Before anything paints, and deliberately not in a component.**

            A reader's chosen theme lives in `localStorage`, which no server can
            see — and this is a static export, so the HTML was built once, with
            no reader in existence. Applying the choice in an effect would paint
            the built theme and correct it a frame later, which is the flash
            every themed site is judged on.

            First child of `<body>`, synchronous: it runs before the markup below
            it is parsed. It touches no React state — the attribute sits on
            `<html>`, outside the tree React hydrates, so it cannot produce a
            hydration mismatch. That is the trap `PracticeModes` documents for
            reading `location` in a render path.

            The CSP allows `'unsafe-inline'` for scripts, which is what makes
            this legal here. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{`
              + `var c=localStorage.getItem('theme');`
              // The one line the final step changes. While the site is still
              // dark-only an unchosen reader gets dark; afterwards this falls
              // through to null and the stylesheet decides.
              + `var t=(c==='light'||c==='dark')?c:'dark';`
              + `document.documentElement.setAttribute('data-theme',t);`
              + `}catch(e){}})()`,
          }}
        />
        {/* The video thumbnails on every course page come from YouTube, which
            is a third origin: without a hint, the first one pays a full DNS +
            TCP + TLS handshake before a byte arrives, and on a course page that
            image can be the largest thing on screen. Cloudflare recorded one at
            10,952 ms. `preconnect` opens the socket while the HTML is still
            parsing; the `dns-prefetch` beside it is the fallback for browsers
            that ignore the first.

            Both hosts, because the markup uses `img.youtube.com` and YouTube
            serves some thumbnails from `i.ytimg.com`. The site's CSP already
            allows exactly these two under `img-src`.

            Next hoists `<link>` out of the tree into `<head>` — they are here
            rather than in a hand-written `<head>`, which App Router does not
            want you to author. */}
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
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
