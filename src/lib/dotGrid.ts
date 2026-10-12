// Shared drawing for the homepage dot grid: the intro ripple (GridLoader) and the cursor glow (HeroGlow)
// paint the same grid, so the dots line up when one hands over to the other.

export const GAP = 18;

export const clamp = (x: number) => Math.max(0, Math.min(1, x));

const hex = (h: string) => [0, 2, 4].map((i) => parseInt(h.trim().replace("#", "").slice(i, i + 2), 16));

export type DotCanvas = { ctx: CanvasRenderingContext2D; width: number; height: number; muted: number[]; accent: number[] };

// Sizes the canvas to its CSS box at the screen's pixel density and reads the palette colours.
export function setupCanvas(canvas: HTMLCanvasElement): DotCanvas | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const { width, height } = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const style = getComputedStyle(document.documentElement);
  return { ctx, width, height, muted: hex(style.getPropertyValue("--muted")), accent: hex(style.getPropertyValue("--accent")) };
}

// Paints every dot. glow(x, y) returns 0..1: 0 is a faint muted dot, 1 a larger orange one.
// `base` is how visible the resting grid is. press(x, y), also 0..1, deepens a glowing dot towards
// a darker burnt orange, for where the cursor clicks or is held down.
export function paintDots(c: DotCanvas, glow: (x: number, y: number) => number, base = 0.22, press?: (x: number, y: number) => number) {
  const { ctx, width: W, height: H, muted, accent } = c;
  const deep = accent.map((a) => a * 0.55);
  ctx.clearRect(0, 0, W, H);
  for (let y = GAP; y < H; y += GAP) {
    for (let x = GAP; x < W; x += GAP) {
      const f = Math.min(1, glow(x, y));
      const d = press ? Math.min(1, press(x, y)) : 0;
      const edge = Math.min(1, Math.min(x, y, W - x, H - y) / (GAP * 3)); // dim towards the edges
      ctx.globalAlpha = Math.min(1, base * edge + f * 0.75 + d * 0.25);
      ctx.fillStyle = `rgb(${muted.map((m, i) => Math.round(m + (accent[i] - m) * f + (deep[i] - accent[i]) * d))})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.9 + f * 1.4 + d * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
