import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Eicto Download Manager | Best Free Video Downloader for PC",
    template: "%s | Eicto Download Manager",
  },
  description: "Download videos from any website with lighting-fast speeds. Eicto is the ultimate free video download manager for Windows. Detects HD, 4K, M3U8, and MP4 videos automatically. The perfect IDM alternative.",
  keywords: [
    "video downloader", "free video downloader", "download videos online", "best video downloader for PC",
    "Windows video downloader", "download manager", "Eicto", "Eicto Download Manager", "fastest video downloader",
    "HD video downloader", "4K video downloader", "IDM alternative", "internet download manager alternative",
    "detect and download videos", "social media video downloader", "browser video downloader", "m3u8 downloader",
    "hls downloader", "video grabber", "download videos from any site", "free IDM", "download streaming video",
    "video saver", "download manager for windows 11", "download manager for windows 10"
  ],
  authors: [{ name: "HikerHarsh" }],
  creator: "HikerHarsh",
  publisher: "Eicto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Eicto Download Manager - The Ultimate Video Downloader",
    description: "Detect and download videos from any website with lightning-fast speeds. The only video download manager you will ever need. Free, fast, and secure.",
    url: "https://eicto.in", // Or your actual domain
    siteName: "Eicto Download Manager",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eicto Download Manager - Fast & Free",
    description: "Detect and download videos from any website with lightning-fast speeds.",
    creator: "@HikerHarsh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification=your_verification_code_here", // Placeholder
  }
};

import AquariumBackground from "./components/AquariumBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AquariumBackground />
        <div className="liquid-bg">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
            <div className="blob blob-4"></div>
        </div>
        <header className="header glass-panel" id="header">
          <div className="container header-content">
            <Link href="/" className="logo-wrapper">
              <img src="/assets/logo.png" alt="Eicto Download Manager Logo" className="logo" />
              <span className="logo-text">Eicto</span>
            </Link>
            <nav className="nav" id="main-nav">
              <ul className="nav-list">
                <li><Link href="/#features" className="nav-link">Features</Link></li>
                <li><Link href="/install" className="nav-link">Install Guide</Link></li>
                <li><Link href="/issues" className="btn btn-nav" style={{ marginLeft: '10px' }}>Issue Board</Link></li>
                <li><a href="https://github.com/HikerHarsh/Eicto-release/releases/download/v1.0.0-beta/EictoSetup_v1.0.0.exe" className="btn btn-nav" target="_blank" rel="noopener noreferrer">Download Now</a></li>
              </ul>
            </nav>
            <button className="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle Menu">
              <span className="hamburger"></span>
            </button>
          </div>
        </header>
        
        {children}

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <img src="/assets/logo.png" alt="Eicto Logo" className="logo-small" />
                <span>Eicto</span>
              </div>
              <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <Link href="/terms">Terms of Service</Link>
                <a href="#">Contact</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 Eicto Download Manager. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Global UI scripts for the layout */}
        <Script id="global-ui" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', () => {
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                const nav = document.getElementById('main-nav');
                
                if (mobileMenuBtn && nav) {
                    mobileMenuBtn.addEventListener('click', () => {
                        mobileMenuBtn.classList.toggle('active');
                        nav.classList.toggle('active');
                    });

                    document.querySelectorAll('.nav-link, .btn-nav').forEach(link => {
                        link.addEventListener('click', () => {
                            mobileMenuBtn.classList.remove('active');
                            nav.classList.remove('active');
                        });
                    });
                }

                const header = document.getElementById('header');
                if (header) {
                    window.addEventListener('scroll', () => {
                        if (window.scrollY > 50) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                    });

                    header.addEventListener('mousemove', (e) => {
                        const rect = header.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        header.style.setProperty('--mouse-x', \`\${x}px\`);
                        header.style.setProperty('--mouse-y', \`\${y}px\`);
                    });
                }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
