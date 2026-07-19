"use client";

import { useEffect, useRef } from "react";
import "./AquariumBackground.css";

export default function AquariumBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        class Fish {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            targetAngle: number;
            angle: number;
            speed: number;
            baseSpeed: number;
            scared: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.angle = Math.random() * Math.PI * 2;
                this.targetAngle = this.angle;
                this.baseSpeed = 0.5 + Math.random() * 1;
                this.speed = this.baseSpeed;
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
                this.size = 15 + Math.random() * 15;
                this.color = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.15})`;
                this.scared = 0;
            }

            update() {
                // If scared, run fast, slowly reduce scare factor
                if (this.scared > 0) {
                    this.speed = this.baseSpeed + (this.scared * 10);
                    this.scared -= 0.02;
                    if (this.scared < 0) this.scared = 0;
                } else {
                    this.speed = this.baseSpeed;
                    
                    // Wander randomly
                    if (Math.random() < 0.02) {
                        this.targetAngle += (Math.random() - 0.5) * Math.PI;
                    }
                }

                // Smoothly rotate towards target angle
                const angleDiff = this.targetAngle - this.angle;
                // Normalize angleDiff to -PI to PI
                let normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
                this.angle += normalizedDiff * 0.05;

                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;

                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges smoothly
                if (this.x < -this.size * 2) this.x = width + this.size * 2;
                if (this.x > width + this.size * 2) this.x = -this.size * 2;
                if (this.y < -this.size * 2) this.y = height + this.size * 2;
                if (this.y > height + this.size * 2) this.y = -this.size * 2;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                // Draw top-down fish (sleek, minimalist)
                ctx.fillStyle = this.color;
                
                // Body
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size, this.size / 3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Tail
                ctx.beginPath();
                ctx.moveTo(-this.size + 2, 0);
                ctx.lineTo(-this.size - this.size/1.5, -this.size/2);
                ctx.lineTo(-this.size - this.size/1.5, this.size/2);
                ctx.fill();

                // Pectoral Fins
                ctx.beginPath();
                ctx.moveTo(0, this.size/3);
                ctx.lineTo(-this.size/2, this.size/1.2);
                ctx.lineTo(this.size/4, this.size/3);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(0, -this.size/3);
                ctx.lineTo(-this.size/2, -this.size/1.2);
                ctx.lineTo(this.size/4, -this.size/3);
                ctx.fill();

                // Eye glow (optional tech feel)
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.beginPath();
                ctx.arc(this.size/2, -this.size/6, 1.5, 0, Math.PI * 2);
                ctx.arc(this.size/2, this.size/6, 1.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        class Ripple {
            x: number;
            y: number;
            radius: number;
            maxRadius: number;
            opacity: number;

            constructor(x: number, y: number, isClick: boolean = false) {
                this.x = x;
                this.y = y;
                this.radius = 1;
                this.maxRadius = isClick ? 150 : 50;
                this.opacity = isClick ? 0.8 : 0.3;
            }

            update() {
                this.radius += 1.5;
                this.opacity -= 0.01;
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.opacity <= 0) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        const fishes: Fish[] = Array.from({ length: 15 }, () => new Fish());
        let ripples: Ripple[] = [];
        let lastMousePos = { x: 0, y: 0 };

        const render = () => {
            // Clear canvas completely each frame
            ctx.clearRect(0, 0, width, height);

            // Update and draw fishes
            fishes.forEach(fish => {
                fish.update();
                fish.draw(ctx);
            });

            // Update and draw ripples
            ripples.forEach(ripple => {
                ripple.update();
                ripple.draw(ctx);
            });

            // Clean up dead ripples
            ripples = ripples.filter(r => r.opacity > 0);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        // Interactions
        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Spawn a ripple if mouse moved enough
            if (distance > 30) {
                ripples.push(new Ripple(e.clientX, e.clientY));
                lastMousePos = { x: e.clientX, y: e.clientY };
            }
        };

        const handleClick = (e: MouseEvent) => {
            // Spawn a big click ripple
            ripples.push(new Ripple(e.clientX, e.clientY, true));
            ripples.push(new Ripple(e.clientX, e.clientY, true));
            setTimeout(() => {
                ripples.push(new Ripple(e.clientX, e.clientY, true));
            }, 100);

            // Scare fishes!
            fishes.forEach(fish => {
                const dx = fish.x - e.clientX;
                const dy = fish.y - e.clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 300) { // Detection radius
                    fish.scared = 1; // Max scare
                    // Dart away from the click
                    fish.targetAngle = Math.atan2(dy, dx);
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="aquarium-canvas" 
        />
    );
}
