"use client";

import { useEffect } from "react";
import Link from "next/link";
import HeroAnimation from "./components/HeroAnimation";

export default function Home() {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
          <div className="container hero-container">
              <div className="hero-text fade-in-up">
                  <h1 className="hero-title">The Ultimate <br/><span className="text-gradient">Video Downloader</span></h1>
                  <p className="hero-subtitle">Detect and download videos from any website with lightning-fast speeds. The only video download manager you will ever need.</p>
                  <div className="hero-cta" id="download">
                      <a href="https://github.com/HikerHarsh/Eicto-release/releases/download/v1.0.0-beta/EictoSetup_v1.0.0.exe" className="btn btn-primary btn-large" target="_blank" rel="noopener noreferrer">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          Download for Windows
                      </a>
                      <p className="version-info">Version 1.0.0 Beta &bull; Currently Free</p>
                  </div>
              </div>
              <div className="hero-visual fade-in-up delay-1">
                  <HeroAnimation />
              </div>
          </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
          <div className="container">
              <div className="section-header fade-in-up">
                  <h2>Why choose <span className="text-gradient">Eicto?</span></h2>
                  <p>Designed for power users who demand speed and simplicity.</p>
              </div>
              <div className="features-grid">
                  <div className="feature-card fade-in-up delay-1">
                      <div className="feature-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"></path><rect x="3" y="6" width="12" height="12" rx="2" ry="2"></rect></svg>
                      </div>
                      <h3>Universal Video Download</h3>
                      <p>Browser extension automatically detects and downloads videos from various websites with a single click.</p>
                  </div>
                  <div className="feature-card fade-in-up delay-2">
                      <div className="feature-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                      </div>
                      <h3>Blazing Fast</h3>
                      <p>Advanced multi-threading technology maximizes your bandwidth to download files up to 10x faster.</p>
                  </div>
                  <div className="feature-card fade-in-up delay-3">
                      <div className="feature-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                      </div>
                      <h3>Smart Organization</h3>
                      <p>Automatically categorizes your downloads into folders based on file types to keep your system clutter-free.</p>
                  </div>
                  <div className="feature-card fade-in-up delay-3">
                      <div className="feature-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </div>
                      <h3>Secure & Private</h3>
                      <p>Your data stays on your machine. We don't track your downloads or share your information with anyone.</p>
                  </div>
              </div>
          </div>
      </section>
    </main>
  );
}
