document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn') as HTMLElement | null;
    const nav = document.querySelector('.nav') as HTMLElement | null;

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link, .btn-nav').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.getElementById('header') as HTMLElement | null;
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    // Observe all elements with .fade-in-up
    document.querySelectorAll('.fade-in-up').forEach((element) => {
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
                if (!element) {
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
                cursor.classList.add('clicking');
                setTimeout(() => {
                    cursor.classList.remove('clicking');
                    setTimeout(resolve, 300);
                }, 150);
            });
        };

        const typeEffect = (text: string, element: HTMLElement): Promise<void> => {
            return new Promise(resolve => {
                element.textContent = '';
                let i = 0;
                const typeChar = () => {
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

            // 2. Move to toggle
            await moveCursorTo(devToggle, 0, 0);
            await clickCursor();
            devToggle.classList.add('active');
            devToolbar.classList.add('active');
            
            await new Promise(r => setTimeout(r, 800));

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

                // Move to extension folder
                const extFolderItem = document.getElementById('extFolderItem') as HTMLElement | null;
                await moveCursorTo(extFolderItem, 0, 0);
                await clickCursor();
                if (extFolderItem) extFolderItem.classList.add('selected');
                
                await new Promise(r => setTimeout(r, 600));

                // Move to select button
                await moveCursorTo(selectFolderBtn, 0, 0);
                await clickCursor();
                selectFolderBtn.style.transform = 'scale(0.95)';
                setTimeout(() => { selectFolderBtn.style.transform = 'scale(1)'; }, 150);
                
                await new Promise(r => setTimeout(r, 400));
                
                // Close dialog
                folderDialog.classList.remove('active');
                
                await new Promise(r => setTimeout(r, 600));
            }
            
            // 5. Show the extension card appearing
            eictoExtCard.classList.add('visible');

            // Hide and repeat
            await new Promise(r => setTimeout(r, 5000));
            cursor.classList.remove('visible');
            
            // Reset position offscreen
            setTimeout(() => {
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
});
