"use client";
import { useEffect, useRef, useState } from "react";
import "./HeroAnimation.css";

export default function HeroAnimation() {
    const [cursorPos, setCursorPos] = useState({ x: '-10%', y: '50%' });
    const [cursorActive, setCursorActive] = useState(false);
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [showEictoApp, setShowEictoApp] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [hoverDownloadBtn, setHoverDownloadBtn] = useState(false);
    const [hover1080p, setHover1080p] = useState(false);
    const [extensionGlowing, setExtensionGlowing] = useState(false);
    const [showDownloadBtn, setShowDownloadBtn] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const runAnimationSequence = async () => {
            while (isMounted) {
                // Reset states
                setCursorPos({ x: '-10%', y: '50%' });
                setCursorActive(false);
                setShowQualityMenu(false);
                setShowEictoApp(false);
                setDownloadProgress(0);
                setHoverDownloadBtn(false);
                setHover1080p(false);
                setExtensionGlowing(false);
                setShowDownloadBtn(false);

                // 0. Initial pause, then Eicto extension detects video
                await new Promise(r => setTimeout(r, 800));
                if (!isMounted) break;
                setExtensionGlowing(true); // Extension icon glows

                await new Promise(r => setTimeout(r, 600));
                if (!isMounted) break;
                setShowDownloadBtn(true); // Button appears on video
                await new Promise(r => setTimeout(r, 400));
                if (!isMounted) break;
                setExtensionGlowing(false);

                // 1. Move to Eicto float button on video
                await new Promise(r => setTimeout(r, 200));
                if (!isMounted) break;
                setCursorPos({ x: 'calc(100% - 75px)', y: '30px' }); // Adjust to match top-right of video
                
                await new Promise(r => setTimeout(r, 800)); // Wait for movement
                if (!isMounted) break;
                setHoverDownloadBtn(true);

                // 2. Click button
                await new Promise(r => setTimeout(r, 200));
                if (!isMounted) break;
                setCursorActive(true);
                await new Promise(r => setTimeout(r, 200));
                setCursorActive(false);
                setHoverDownloadBtn(false);
                setShowQualityMenu(true);

                // 3. Move down to "1080p" quality
                await new Promise(r => setTimeout(r, 400));
                if (!isMounted) break;
                setCursorPos({ x: 'calc(100% - 100px)', y: '165px' }); // Move down slightly to 1080p option

                await new Promise(r => setTimeout(r, 800)); // Wait for movement
                if (!isMounted) break;
                setHover1080p(true);

                // 4. Click quality
                await new Promise(r => setTimeout(r, 200));
                if (!isMounted) break;
                setCursorActive(true);
                await new Promise(r => setTimeout(r, 200));
                setCursorActive(false);
                setHover1080p(false);
                setShowQualityMenu(false);

                // 5. Show Eicto App Popup
                await new Promise(r => setTimeout(r, 500));
                if (!isMounted) break;
                setShowEictoApp(true);
                setCursorPos({ x: '120%', y: '80%' }); // Move cursor out of the way

                // 6. Animate progress
                await new Promise(r => setTimeout(r, 600));
                for(let i=0; i<=100; i+=2) {
                    if (!isMounted) break;
                    setDownloadProgress(i);
                    await new Promise(r => setTimeout(r, 30));
                }

                // 7. Wait and restart
                await new Promise(r => setTimeout(r, 4000));
            }
        };

        runAnimationSequence();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="hero-animation-container">
            {/* The Main Browser Mockup */}
            <div className={`browser-mockup ${showEictoApp ? 'blur-bg' : ''}`}>
                <div className="mockup-header">
                    <div className="window-controls">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                    <div className="mockup-url-bar">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        youtube.com/watch?v=awesome
                    </div>
                    <div className="mockup-extensions">
                        <div className={`ext-icon ${extensionGlowing ? 'glowing' : ''}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </div>
                    </div>
                </div>
                <div className="mockup-body video-player-mockup">
                    <div className="video-placeholder">
                        <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        <div className="video-progress-bar"></div>
                        
                        {/* Eicto Floating Button */}
                        <div className={`eicto-float-btn ${hoverDownloadBtn ? 'simulated-hover' : ''} ${showDownloadBtn ? 'visible' : ''}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download
                        </div>

                        {/* Quality Dropdown */}
                        <div className={`quality-dropdown ${showQualityMenu ? 'visible' : ''}`}>
                            <div className="quality-header">Download Quality</div>
                            <div className="quality-options">
                                <div className="quality-option">8K <span className="size">2.4 GB</span></div>
                                <div className="quality-option">4K <span className="size">1.1 GB</span></div>
                                <div className="quality-option">1440p <span className="size">650 MB</span></div>
                                <div className={`quality-option ${hover1080p ? 'simulated-hover hover-target' : 'hover-target'}`}>1080p <span className="size">250 MB</span></div>
                                <div className="quality-option">720p <span className="size">120 MB</span></div>
                                <div className="quality-option">480p <span className="size">65 MB</span></div>
                                <div className="quality-option">360p <span className="size">40 MB</span></div>
                                <div className="quality-option">144p <span className="size">15 MB</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Virtual Cursor */}
                    <div 
                        className={`virtual-cursor-hero ${cursorActive ? 'active' : ''}`}
                        style={{
                            left: cursorPos.x,
                            top: cursorPos.y,
                        }}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 3.21V20.8C5.5 21.45 6.27 21.8 6.76 21.36L11.44 17.15H17.5C18.05 17.15 18.5 16.7 18.5 16.15V15.75L5.5 3.21Z" fill="white" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Eicto App Popup */}
            <div className={`eicto-app-popup ${showEictoApp ? 'visible' : ''}`}>
                <div className="app-header">
                    <div className="app-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Eicto Download Manager
                    </div>
                    <div className="app-controls">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
                <div className="app-body">
                    <div className="download-row active">
                        <div className="file-icon bg-blue"></div>
                        <div className="file-details">
                            <div className="file-name">Awesome_Video_1080p.mp4</div>
                            <div className="file-progress-bar">
                                <div className="progress" style={{ width: `${downloadProgress}%` }}></div>
                            </div>
                        </div>
                        <div className="file-speed">
                            {downloadProgress === 100 ? <span className="text-green">Completed</span> : '45 MB/s'}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
