import { useEffect, useRef } from 'react';

export default function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track particles
    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedY: number;
      speedX: number;
      alpha: number;
      alphaSpeed: number;
      glow: boolean;
    }

    const particles: Particle[] = [];
    const colors = [
      'rgba(255, 159, 67, 0.15)',  // Warm orange container
      'rgba(253, 215, 59, 0.15)',  // Joyful yellow container
      'rgba(179, 173, 255, 0.15)', // Pastel purple container
      'rgba(143, 78, 0, 0.08)',    // Soft primary transparent
    ];

    // Initialize particles
    const initParticles = () => {
      const numParticles = Math.min(Math.floor((width * height) / 15000), 50);
      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        const radius = Math.random() * 20 + 8;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedY: -(Math.random() * 0.4 + 0.1), // Slow rising
          speedX: (Math.random() * 0.4 - 0.2), // Tiny drift
          alpha: Math.random() * 0.5 + 0.1,
          alphaSpeed: Math.random() * 0.005 + 0.001,
          glow: Math.random() > 0.5,
        });
      }
    };

    initParticles();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!entries || !entries.length) return;
        for (let entry of entries) {
          const { width: newWidth, height: newHeight } = entry.contentRect;
          width = canvas.width = newWidth;
          height = canvas.height = newHeight;
          initParticles();
        }
      });
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Interactive mouse circle
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle glowing background nodes first (gradients)
      ctx.save();
      const numGlows = 3;
      for (let g = 0; g < numGlows; g++) {
        const x = width * (0.2 + g * 0.3);
        const y = height * (0.1 + g * 0.35);
        const radius = Math.min(width, height) * 0.25;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        if (g === 0) {
          grad.addColorStop(0, 'rgba(255, 235, 204, 0.3)'); // Soft Peach/Orange
        } else if (g === 1) {
          grad.addColorStop(0, 'rgba(254, 249, 195, 0.35)'); // Soft Light Yellow
        } else {
          grad.addColorStop(0, 'rgba(227, 223, 255, 0.25)'); // Soft Lavender
        }
        grad.addColorStop(1, 'rgba(244, 250, 253, 0)'); // Fades into page background
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Update & Draw particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Warp boundaries
        if (p.y + p.radius < 0) {
          p.y = height + p.radius;
          p.x = Math.random() * width;
        }
        if (p.x + p.radius < 0) p.x = width + p.radius;
        if (p.x - p.radius > width) p.x = -p.radius;

        // Glow twinkle logic
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.8 || p.alpha < 0.1) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.glow ? 15 : 0;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Extra highlight on mouse hover
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = (1 - dist / 150) * 0.4;
          ctx.stroke();
        }
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      id="magic-canvas-bg"
      ref={canvasRef}
      className="absolute inset-0 block pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
