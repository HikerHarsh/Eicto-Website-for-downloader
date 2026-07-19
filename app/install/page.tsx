"use client";

import { useEffect } from "react";

export default function InstallGuide() {

    useEffect(() => {
        let isCancelled = false;

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.fade-in-up').forEach(element => {
            observer.observe(element);
        });

        // Virtual Cursor Animation for Install Page
        const cursor = document.getElementById('virtualCursor') as HTMLElement | null;
        if (cursor) {
            const typeText = document.getElementById('typeText') as HTMLElement;
            const typeCursor = document.getElementById('typeCursor') as HTMLElement | null;
            const devToggle = document.getElementById('devToggle') as HTMLElement;
            const devToolbar = document.getElementById('devToolbar') as HTMLElement;
            const loadBtn = document.getElementById('loadUnpackedBtn') as HTMLElement;
            const eictoExtCard = document.getElementById('eictoExtCard') as HTMLElement;
            const textToType = "chrome://extensions";
            
            const moveCursorTo = (element: HTMLElement | null, offsetX: number = 0, offsetY: number = 0): Promise<void> => {
                return new Promise(resolve => {
                    if (!element || isCancelled) {
                        resolve();
                        return;
                    }
                    const rect = element.getBoundingClientRect();
                    const x = rect.left + window.scrollX + rect.width / 2 + offsetX;
                    const y = rect.top + window.scrollY + rect.height / 2 + offsetY;
                    
                    cursor.style.left = `${x}px`;
                    cursor.style.top = `${y}px`;
                    
                    setTimeout(resolve, 1200);
                });
            };

            const clickCursor = (): Promise<void> => {
                return new Promise(resolve => {
                    if (isCancelled) {
                        resolve();
                        return;
                    }
                    cursor.classList.add('clicking');
                    setTimeout(() => {
                        cursor.classList.remove('clicking');
                        setTimeout(resolve, 300);
                    }, 150);
                });
            };

            const typeEffect = (text: string, element: HTMLElement): Promise<void> => {
                return new Promise(resolve => {
                    if (isCancelled) {
                        resolve();
                        return;
                    }
                    element.textContent = '';
                    let i = 0;
                    const typeChar = () => {
                        if (isCancelled) return resolve();
                        if (i < text.length) {
                            element.textContent += text.charAt(i);
                            i++;
                            setTimeout(typeChar, 80);
                        } else {
                            setTimeout(resolve, 500);
                        }
                    };
                    typeChar();
                });
            };

            const runAnimationSequence = async () => {
                if (isCancelled) return;
                cursor.classList.add('visible');
                
                // Reset state
                typeText.textContent = '';
                if (typeCursor) typeCursor.style.display = 'inline-block';
                devToggle.classList.remove('active');
                devToolbar.classList.remove('active');
                eictoExtCard.classList.remove('visible');
                
                // 1. Move to address bar
                await moveCursorTo(typeText, 30, 0);
                await clickCursor();
                
                // Type text
                await typeEffect(textToType, typeText);
                if (typeCursor) typeCursor.style.display = 'none';
                await new Promise(r => setTimeout(r, 600));
                if (isCancelled) return;

                // 2. Move to toggle
                await moveCursorTo(devToggle, 0, 0);
                await clickCursor();
                devToggle.classList.add('active');
                devToolbar.classList.add('active');
                
                await new Promise(r => setTimeout(r, 800));
                if (isCancelled) return;

                // 3. Move to Load Unpacked button
                await moveCursorTo(loadBtn, 0, 0);
                await clickCursor();
                
                // Show active state on button
                loadBtn.style.transform = 'scale(0.95)';
                loadBtn.style.background = '#e5e7eb';
                setTimeout(() => {
                    loadBtn.style.transform = 'scale(1)';
                    loadBtn.style.background = '#fff';
                }, 150);

                await new Promise(r => setTimeout(r, 600));
                if (isCancelled) return;

                // 4. Show folder dialog
                const folderDialog = document.getElementById('folderDialog') as HTMLElement | null;
                const folderPath = document.querySelector('.folder-path') as HTMLElement | null;
                const folderBody = document.querySelector('.folder-body') as HTMLElement | null;
                const selectFolderBtn = document.getElementById('selectFolderBtn') as HTMLElement | null;
                
                if (folderDialog && selectFolderBtn && folderPath && folderBody) {
                    // Helper for double click
                    const doubleClickCursor = async () => {
                        await clickCursor();
                        await new Promise(r => setTimeout(r, 50));
                        await clickCursor();
                    };

                    // Initial State: This PC
                    folderPath.textContent = 'This PC';
                    folderBody.innerHTML = `
                        <div class="folder-item" id="driveC">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><line x1="6" y1="15" x2="6.01" y2="15"></line></svg>
                            Local Disk (C:)
                        </div>
                    `;
                    folderDialog.classList.add('active');
                    await new Promise(r => setTimeout(r, 600));
                    if (isCancelled) return;

                    // Move to Local Disk C
                    const driveC = document.getElementById('driveC') as HTMLElement | null;
                    await moveCursorTo(driveC, 0, 0);
                    await clickCursor();
                    if (driveC) driveC.classList.add('selected');
                    await new Promise(r => setTimeout(r, 200));
                    await doubleClickCursor();

                    // State: C:\
                    folderPath.textContent = 'C:\\\\';
                    folderBody.innerHTML = `
                        <div class="folder-item" id="progFiles">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            Program Files
                        </div>
                    `;
                    await new Promise(r => setTimeout(r, 400));
                    if (isCancelled) return;

                    // Move to Program Files
                    const progFiles = document.getElementById('progFiles') as HTMLElement | null;
                    await moveCursorTo(progFiles, 0, 0);
                    await clickCursor();
                    if (progFiles) progFiles.classList.add('selected');
                    await new Promise(r => setTimeout(r, 200));
                    await doubleClickCursor();

                    // State: C:\Program Files
                    folderPath.textContent = 'C:\\\\Program Files';
                    folderBody.innerHTML = `
                        <div class="folder-item" id="eictoFolder">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            Eicto Download Manager
                        </div>
                    `;
                    await new Promise(r => setTimeout(r, 400));
                    if (isCancelled) return;

                    // Move to Eicto Folder
                    const eictoFolder = document.getElementById('eictoFolder') as HTMLElement | null;
                    await moveCursorTo(eictoFolder, 0, 0);
                    await clickCursor();
                    if (eictoFolder) eictoFolder.classList.add('selected');
                    await new Promise(r => setTimeout(r, 200));
                    await doubleClickCursor();

                    // State: C:\Program Files\Eicto Download Manager
                    folderPath.textContent = 'C:\\\\Program Files\\\\Eicto Download Manager';
                    folderBody.innerHTML = `
                        <div class="folder-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            assets
                        </div>
                        <div class="folder-item" id="extFolderItem">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            extension
                        </div>
                        <div class="folder-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                            eicto.exe
                        </div>
                    `;
                    await new Promise(r => setTimeout(r, 400));
                    if (isCancelled) return;

                    // Move to extension folder
                    const extFolderItem = document.getElementById('extFolderItem') as HTMLElement | null;
                    await moveCursorTo(extFolderItem, 0, 0);
                    await clickCursor();
                    if (extFolderItem) extFolderItem.classList.add('selected');
                    
                    await new Promise(r => setTimeout(r, 600));
                    if (isCancelled) return;

                    // Move to select button
                    await moveCursorTo(selectFolderBtn, 0, 0);
                    await clickCursor();
                    selectFolderBtn.style.transform = 'scale(0.95)';
                    setTimeout(() => { selectFolderBtn.style.transform = 'scale(1)'; }, 150);
                    
                    await new Promise(r => setTimeout(r, 400));
                    
                    // Close dialog
                    folderDialog.classList.remove('active');
                    
                    await new Promise(r => setTimeout(r, 600));
                    if (isCancelled) return;
                }
                
                // 5. Show the extension card appearing
                eictoExtCard.classList.add('visible');

                // Hide and repeat
                await new Promise(r => setTimeout(r, 5000));
                if (isCancelled) return;
                cursor.classList.remove('visible');
                
                // Reset position offscreen
                setTimeout(() => {
                    if (isCancelled) return;
                    cursor.style.left = '50vw';
                    cursor.style.top = '100vh';
                    setTimeout(runAnimationSequence, 1000);
                }, 1000);
            };

            // Initialize position
            cursor.style.left = '50vw';
            cursor.style.top = '100vh';
            
            // Start sequence
            setTimeout(runAnimationSequence, 1500);
        }

        return () => {
            isCancelled = true;
        };
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <main>
            {/* Installation Content */}
            <section className="install-section">
                <div className="container install-container" style={{ position: 'relative' }}>
                    <h1 className="install-title" style={{ marginBottom: '20px' }}>Extension Installation Guide</h1>
                    
                    <div className="copy-links" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '40px' }}>
                        <div className="copy-box" style={{ margin: 0 }}>
                            <p style={{ margin: 0, fontSize: '12px' }}>Chrome/Brave: <span className="highlight">chrome://extensions</span></p>
                            <button className="btn-copy" onClick={() => copyToClipboard('chrome://extensions')} style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}>Copy</button>
                        </div>
                        <div className="copy-box" style={{ margin: 0 }}>
                            <p style={{ margin: 0, fontSize: '12px' }}>Edge: <span className="highlight">edge://extensions</span></p>
                            <button className="btn-copy" onClick={() => copyToClipboard('edge://extensions')} style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}>Copy</button>
                        </div>
                    </div>
                    
                    <div className="chrome-window fade-in-up delay-1" style={{ position: 'relative' }}>
                        <div className="chrome-header">
                            <div className="chrome-controls">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="chrome-tabs">
                                <div className="chrome-tab active">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                                    Extensions
                                </div>
                            </div>
                        </div>
                        <div className="chrome-toolbar">
                            <div className="chrome-nav-btns">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                            </div>
                            <div className="chrome-address-bar">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span id="typeText">chrome://extensions</span><span className="blinking-cursor" id="typeCursor">|</span>
                                </div>
                            </div>
                        </div>
                        <div className="chrome-body">
                            <div className="ext-header">
                                <h2>Extensions</h2>
                                <div className="ext-search">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    Search extensions
                                </div>
                                <div className="ext-dev-mode">
                                    <span>Developer mode</span>
                                    <div className="toggle-switch" id="devToggle">
                                        <div className="toggle-knob"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="ext-dev-toolbar" id="devToolbar">
                                <div className="fake-btn" id="loadUnpackedBtn">Load unpacked</div>
                                <div className="fake-btn secondary">Pack extension</div>
                                <div className="fake-btn secondary">Update</div>
                            </div>
                            
                            <div className="ext-grid">
                                <div className="ext-card">
                                    <div className="ext-card-header">
                                        <div className="ext-icon" style={{ background: '#58a6ff' }}></div>
                                        <div className="ext-info">
                                            <h4>AdBlocker Pro</h4>
                                            <p>2.1.0</p>
                                        </div>
                                        <div className="toggle-switch active"><div className="toggle-knob"></div></div>
                                    </div>
                                    <div className="ext-card-desc">Blocks annoying ads and popups on the web.</div>
                                </div>
                                <div className="ext-card" id="eictoExtCard">
                                    <div className="ext-card-header">
                                        <div className="ext-icon"><img src="/assets/logo.png" width="100%" alt="logo"/></div>
                                        <div className="ext-info">
                                            <h4>Eicto Download Manager</h4>
                                            <p>1.0.0</p>
                                        </div>
                                        <div className="toggle-switch active"><div className="toggle-knob"></div></div>
                                    </div>
                                    <div className="ext-card-desc">The ultimate video downloader extension.</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Fake Folder Dialog */}
                        <div className="folder-dialog" id="folderDialog">
                            <div className="folder-header">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                Select Extension Directory
                            </div>
                            <div className="folder-path">
                                C:\Program Files\Eicto Download Manager
                            </div>
                            <div className="folder-body">
                                <div className="folder-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                    assets
                                </div>
                                <div className="folder-item" id="extFolderItem">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                    extension
                                </div>
                                <div className="folder-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                    eicto.exe
                                </div>
                            </div>
                            <div className="folder-footer">
                                <button className="btn-select" id="selectFolderBtn">Select Folder</button>
                            </div>
                        </div>

                    </div>

                    <div className="success-box fade-in-up delay-3" style={{ marginTop: '40px', textAlign: 'center' }}>
                        <h3>✅ That's it! You are ready to go.</h3>
                        <p>You will now see a magical Eicto download button floating near all videos on the internet!</p>
                    </div>

                </div>
            </section>

            {/* Virtual Cursor for Animation */}
            <div className="virtual-cursor" id="virtualCursor">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff" stroke="#000000" strokeWidth="1.5"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.35z"></path></svg>
            </div>
        </main>
    );
}
