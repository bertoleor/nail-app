"use client";

import React, { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// CONFIGURACIÓN — ajustar aquí sin tocar el resto del componente
// ---------------------------------------------------------------------------

// Parejas de colores que conviven. Se muestran de a una por vez
// con crossfade suave entre ellas.
const COLOR_PAIRS: readonly (readonly [RGB, RGB])[] = [
  [{ b: 152, g: 251, r: 152 }, { b: 153, g: 235, r: 255 }], // menta + amarillo
  [{ b: 250, g: 206, r: 135 }, { b: 226, g: 180, r: 216 }], // celeste + violeta
  [{ b: 193, g: 182, r: 255 }, { b: 162, g: 200, r: 255 }], // rosa + naranja
  [{ b: 255, g: 196, r: 176 }, { b: 152, g: 251, r: 152 }], // azul periwinkle + menta
];

const FRAMES_PER_PAIR = 420; // frames que dura cada par (~7s a 60fps)
const FADE_FRAMES     = 90;  // frames del crossfade entre pares (~1.5s)
const PARTICLE_SPEED  = 0.55; // velocidad de movimiento
const BREATH_AMOUNT   = 0.12; // cuánto pulsa el tamaño
const BREATH_SPEED    = 0.003; // velocidad del pulso
const BASE_OPACITY    = 0.55; // opacidad máxima en el centro del gradiente
const VEIL_OPACITY    = 0.2; // velo final que suaviza la mezcla
const BG_COLOR        = "#f8f9fb"; // color base del canvas

// ---------------------------------------------------------------------------

interface Particle {
  readonly baseSize: number;
  readonly color: RGB;
  size: number;
  tick: number;
  readonly vx: number;
  readonly vy: number;
  x: number;
  y: number;
}

interface RGB { readonly b: number; readonly g: number; readonly r: number; }

export default function BackgroundMesh(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}
    const ctx = canvas.getContext("2d");
    if (!ctx) {return;}

    const reducedMotion = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const speed = reducedMotion ? 0 : PARTICLE_SPEED;

    let width = 0;
    let height = 0;
    let particles: readonly Particle[] = [];
    let globalTick = FRAMES_PER_PAIR / 2;
    let rafId = 0;
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const drawFrame = () => {
      if (!ctx) {return;}
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);
      globalTick++;
      const opacities = getPairOpacities(globalTick, COLOR_PAIRS.length);
      drawParticles(ctx, particles, opacities, width, height);
      ctx.fillStyle = `rgba(248,249,251,${VEIL_OPACITY})`;
      ctx.fillRect(0, 0, width, height);
      rafId = requestAnimationFrame(drawFrame);
    };

    const start = () => {
      const res = initCanvas(canvas, speed);
      width = res.w;
      height = res.h;
      particles = res.p;
      drawFrame();
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (canvas) {
          const res = initCanvas(canvas, speed);
          width = res.w;
          height = res.h;
          particles = res.p;
        }
      }, 200);
    };

    globalThis.addEventListener("resize", handleResize);
    start();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      globalThis.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      ref={canvasRef}
      tabIndex={-1}
    />
  );
}

function createParticle(
  width: number,
  height: number,
  color: RGB,
  speed: number,
): Particle {
  const baseSize =
    Math.max(width * 0.55, 500) + Math.random() * width * 0.35;
  return {
    baseSize,
    color,
    size: baseSize,
    tick: Math.random() * 100,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    x: Math.random() * width,
    y: Math.random() * height,
  };
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: readonly Particle[],
  opacities: readonly number[],
  width: number,
  height: number,
) {
  for (const [pairIndex, pair] of COLOR_PAIRS.entries()) {
    const pairAlpha = opacities[pairIndex];
    if (pairAlpha >= 0.01) {
      for (const [colorIndex, color] of pair.entries()) {
        const p = particles[pairIndex * 2 + colorIndex];
        updateAndDrawParticle(ctx, p, color, pairAlpha, width, height);
      }
    }
  }
}

function getPairOpacities(globalTick: number, pairCount: number): readonly number[] {
  const totalCycle = FRAMES_PER_PAIR * pairCount;
  const t = globalTick % totalCycle;
  const opacities = new Array<number>(pairCount).fill(0);

  for (let i = 0; i < pairCount; i++) {
    const start = i * FRAMES_PER_PAIR;
    const local = t - start;
    if (local < 0 || local >= FRAMES_PER_PAIR) {continue;}

    let alpha: number;
    if (local < FADE_FRAMES) {
      alpha = local / FADE_FRAMES;
    } else if (local > FRAMES_PER_PAIR - FADE_FRAMES) {
      alpha = (FRAMES_PER_PAIR - local) / FADE_FRAMES;
    } else {
      alpha = 1;
    }
    opacities[i] = alpha;
  }

  const lastStart = (pairCount - 1) * FRAMES_PER_PAIR;
  const lastLocal = t - lastStart;
  if (lastLocal > FRAMES_PER_PAIR - FADE_FRAMES) {
    const bleed = (lastLocal - (FRAMES_PER_PAIR - FADE_FRAMES)) / FADE_FRAMES;
    opacities[0] = Math.max(opacities[0], bleed);
  }

  return opacities;
}

function initCanvas(canvas: HTMLCanvasElement, speed: number) {
  const w = globalThis.innerWidth;
  const h = globalThis.innerHeight;
  canvas.width = w;
  canvas.height = h;
  const p = COLOR_PAIRS.flatMap((pair) =>
    pair.map((color) => createParticle(w, h, color, speed)),
  );
  return { h, p, w };
}

function updateAndDrawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  color: RGB,
  pairAlpha: number,
  w: number,
  h: number,
) {
  p.tick += BREATH_SPEED;
  p.size = p.baseSize + Math.sin(p.tick) * p.baseSize * BREATH_AMOUNT;
  p.x += p.vx;
  p.y += p.vy;
  if (p.x < -p.size) {p.x = w + p.size;}
  if (p.x > w + p.size) {p.x = -p.size;}
  if (p.y < -p.size) {p.y = h + p.size;}
  if (p.y > h + p.size) {p.y = -p.size;}

  const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
  const { b, g, r } = color;
  grad.addColorStop(0, `rgba(${r},${g},${b},${BASE_OPACITY * pairAlpha})`);
  grad.addColorStop(0.5, `rgba(${r},${g},${b},${0.2 * pairAlpha})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}
