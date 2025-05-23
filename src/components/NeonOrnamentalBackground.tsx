"use client";
import { useEffect, useRef } from "react";

interface NeonOrnamentalBackgroundProps {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function NeonOrnamentalBackground({ colors }: NeonOrnamentalBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // animated position for smooth movement
  const animRef = useRef({ x: -1000, y: -1000 });
  // target position (mouse)
  const mouseRef = useRef({ x: -1000, y: -1000, visible: false });

  // Draw geometric flower/star pattern tile
  function drawPatternTile(ctx: CanvasRenderingContext2D, size: number) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 7;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 * 0.95; // slightly less than half tile for seamlessness
    // Draw central circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();
    // Draw 6 surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let patternTileSize = 60;
    // Create pattern tile
    const tileCanvas = document.createElement("canvas");
    tileCanvas.width = tileCanvas.height = patternTileSize * dpr;
    const tileCtx = tileCanvas.getContext("2d")!;
    tileCtx.scale(dpr, dpr);
    drawPatternTile(tileCtx, patternTileSize);
    const pattern = ctx.createPattern(tileCanvas, "repeat");

    // Create offscreen for pattern
    const patternCanvas = document.createElement("canvas");
    const maskCanvas = document.createElement("canvas");
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      patternCanvas.width = width * dpr;
      patternCanvas.height = height * dpr;
      maskCanvas.width = width * dpr;
      maskCanvas.height = height * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      animRef.current.x = lerp(animRef.current.x, mouseRef.current.x, 0.18);
      animRef.current.y = lerp(animRef.current.y, mouseRef.current.y, 0.18);
      // 1. Draw pattern on offscreen
      const pctx = patternCanvas.getContext("2d")!;
      pctx.setTransform(1, 0, 0, 1, 0, 0);
      pctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
      if (pattern) {
        pctx.globalAlpha = 1;
        pctx.fillStyle = pattern;
        pctx.fillRect(0, 0, width * dpr, height * dpr);
      }
      // 2. Draw mask with alpha gradient
      const mctx = maskCanvas.getContext("2d")!;
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      if (mouseRef.current.visible) {
        const grad = mctx.createRadialGradient(
          animRef.current.x * dpr,
          animRef.current.y * dpr,
          0,
          animRef.current.x * dpr,
          animRef.current.y * dpr,
          300 * dpr
        );
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.3, "rgba(255,255,255,0.95)");
        grad.addColorStop(0.5, "rgba(255,255,255,0.7)");
        grad.addColorStop(0.7, "rgba(255,255,255,0.4)");
        grad.addColorStop(0.85, "rgba(255,255,255,0.1)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        mctx.fillStyle = grad;
        mctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      } else {
        mctx.fillStyle = "rgba(0,0,0,1)";
        mctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
      // 3. Draw black background on main canvas
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      // 4. Draw pattern with mask using destination-in
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.drawImage(patternCanvas, 0, 0, width, height);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(maskCanvas, 0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
      // 5. Draw glow following the mouse (over pattern)
      if (mouseRef.current.visible) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(animRef.current.x, animRef.current.y, 300, 0, 2 * Math.PI);
        ctx.closePath();
        const glowGrad = ctx.createRadialGradient(
          animRef.current.x,
          animRef.current.y,
          0,
          animRef.current.x,
          animRef.current.y,
          300
        );
        glowGrad.addColorStop(0, colors.primary + "99");
        glowGrad.addColorStop(0.4, colors.secondary + "44");
        glowGrad.addColorStop(0.7, "rgba(0,0,0,0.15)");
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.filter = "blur(80px)";
        ctx.fill();
        ctx.filter = "none";
        ctx.restore();
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();
    // Mouse events
    function handleMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left);
      mouseRef.current.y = (e.clientY - rect.top);
      mouseRef.current.visible = true;
    }
    function handleLeave() {
      // Do not set visible = false, keep the light at last position
      // mouseRef.current.visible = false;
    }
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(animationId);
    };
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-auto"
      style={{ width: "100vw", height: "100vh", background: "black" }}
    />
  );
} 