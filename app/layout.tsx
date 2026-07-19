import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Eicto Download Manager",
  description: "The ultimate video download manager. Detect and download videos from various websites with a single click.",
};

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
        <header className="header" id="header">
          <div className="container header-content">
            <Link href="/" className="logo-wrapper">
              <img src="/assets/logo.png" alt="Eicto Download Manager Logo" className="logo" />
              <span className="logo-text">Eicto</span>
            </Link>
            <nav className="nav" id="main-nav">
              <ul className="nav-list">
                <li><Link href="/#features" className="nav-link">Features</Link></li>
                <li><Link href="/install" className="nav-link">Install Guide</Link></li>
                <li><Link href="/#support" className="nav-link">Support</Link></li>
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
                <a href="#">Terms of Service</a>
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
                }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
