export type Season = "spring" | "summer" | "autumn" | "winter";

type SeasonalSetting =
  | { enabled: false; season?: Season }
  | { enabled: true; season?: Season };

type ParticleKind = "snow" | "petal" | "leaf" | "firefly";

type Particle = {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  phase: number;
  phaseSpeed: number;
  swayAmplitude: number;
  emoji?: string;
};

const STORAGE_KEY = "uhdwiki:seasonal-effects";
const CANVAS_ID = "vp-seasonal-canvas";
const EMOJI_FONTS =
  '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif';
const AUTUMN_EMOJIS = [
  "\u{1F341}", // 🍁
  "\u{1F341}", // 🍁
  "\u{1F342}", // 🍂
  "\u{1F341}", // 🍁
  "\u{1F343}" // 🍃
] as const;

const MAX_DPR = 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(values: readonly T[]): T {
  return values[(Math.random() * values.length) | 0]!;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function readSetting(): SeasonalSetting {
  if (typeof window === "undefined") return { enabled: true };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { enabled: true };

    const trimmed = raw.trim();
    if (trimmed === "off") return { enabled: false };
    if (trimmed === "auto") return { enabled: true };
    if (
      trimmed === "spring" ||
      trimmed === "summer" ||
      trimmed === "autumn" ||
      trimmed === "winter"
    ) {
      return { enabled: true, season: trimmed };
    }

    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return { enabled: true };

    const obj = parsed as Record<string, unknown>;
    const enabled = obj.enabled;
    const season = obj.season;

    const setting: SeasonalSetting = {
      enabled: enabled === false ? false : true
    };

    if (
      season === "spring" ||
      season === "summer" ||
      season === "autumn" ||
      season === "winter"
    ) {
      setting.season = season;
    }

    return setting;
  } catch {
    return { enabled: true };
  }
}

function getSeasonByMonth(date: Date): Season {
  const month = date.getMonth() + 1;
  if (month === 12 || month === 1 || month === 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "autumn";
}

function getIsDark() {
  return document.documentElement.classList.contains("dark");
}

function targetParticleCount(season: Season, width: number, height: number) {
  const area = width * height;
  const base = width < 640 ? 0.75 : 1;

  const raw =
    season === "winter"
      ? area / 12000
      : season === "spring"
        ? area / 18000
        : season === "autumn"
          ? area / 22000
          : area / 24000;

  const capped =
    season === "winter"
      ? clamp(raw, 35, 180)
      : season === "spring"
        ? clamp(raw, 25, 140)
        : season === "autumn"
          ? clamp(raw, 18, 90)
          : clamp(raw, 14, 70);

  return Math.round(capped * base);
}

function makeParticle(season: Season, width: number, height: number): Particle {
  switch (season) {
    case "winter": {
      const size = random(1.2, 3.2);
      return {
        kind: "snow",
        x: random(0, width),
        y: random(-height, height),
        vx: random(-0.25, 0.25),
        vy: random(0.6, 1.6),
        size,
        rotation: 0,
        rotationSpeed: 0,
        opacity: random(0.35, 0.9),
        phase: random(0, Math.PI * 2),
        phaseSpeed: random(0.015, 0.04),
        swayAmplitude: random(0.15, 0.6)
      };
    }
    case "spring": {
      const size = random(6, 14);
      return {
        kind: "petal",
        x: random(-20, width + 20),
        y: random(-height, height),
        vx: random(-0.35, 0.35),
        vy: random(0.85, 2.2),
        size,
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.03, 0.04),
        opacity: random(0.5, 0.95),
        phase: random(0, Math.PI * 2),
        phaseSpeed: random(0.02, 0.055),
        swayAmplitude: random(0.6, 1.8)
      };
    }
    case "autumn": {
      const size = random(14, 26);
      return {
        kind: "leaf",
        x: random(-40, width + 40),
        y: random(-height, height),
        vx: random(-0.45, 0.45),
        vy: random(0.95, 2.5),
        size,
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.05, 0.08),
        opacity: random(0.55, 0.95),
        phase: random(0, Math.PI * 2),
        phaseSpeed: random(0.015, 0.04),
        swayAmplitude: random(0.9, 2.8),
        emoji: pick(AUTUMN_EMOJIS)
      };
    }
    case "summer": {
      const size = random(1.3, 2.6);
      return {
        kind: "firefly",
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.55, 0.55),
        vy: random(-0.45, 0.45),
        size,
        rotation: 0,
        rotationSpeed: 0,
        opacity: random(0.25, 0.8),
        phase: random(0, Math.PI * 2),
        phaseSpeed: random(0.015, 0.05),
        swayAmplitude: 0
      };
    }
  }
}

function recycleParticle(p: Particle, season: Season, width: number, height: number) {
  const replacement = makeParticle(season, width, height);
  Object.assign(p, replacement);

  if (season === "winter" || season === "spring" || season === "autumn") {
    p.y = -random(10, height * 0.25);
  }
}

function updateParticle(
  p: Particle,
  season: Season,
  dtMs: number,
  width: number,
  height: number
) {
  const dt = dtMs / 16.6667;

  if (p.kind === "firefly") {
    const wobble = Math.sin(p.phase * 2.2) * 0.35;
    p.phase += p.phaseSpeed * dt;

    p.vx += random(-0.04, 0.04) * dt;
    p.vy += random(-0.04, 0.04) * dt;

    const maxSpeed = 0.9;
    p.vx = clamp(p.vx, -maxSpeed, maxSpeed);
    p.vy = clamp(p.vy, -maxSpeed, maxSpeed);

    p.x += (p.vx + wobble) * dt;
    p.y += p.vy * dt;

    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;

    return;
  }

  const sway = Math.sin(p.phase) * p.swayAmplitude;
  p.phase += p.phaseSpeed * dt;

  p.x += (p.vx + sway) * dt;
  p.y += p.vy * dt;
  p.rotation += p.rotationSpeed * dt;

  if (p.y > height + 60 || p.x < -80 || p.x > width + 80) {
    recycleParticle(p, season, width, height);
  }
}

function drawSnow(ctx: CanvasRenderingContext2D, p: Particle, isDark: boolean) {
  const fill = isDark ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)";
  const stroke = isDark ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.12)";

  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();

  if (p.size >= 2) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Particle, isDark: boolean) {
  const color = isDark ? "rgba(255,183,197,0.9)" : "rgba(255,153,183,0.75)";
  const outline = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)";

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.restore();
}

function drawLeafEmoji(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;
  ctx.font = `${Math.round(p.size)}px ${EMOJI_FONTS}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.emoji ?? "\u{1F341}", 0, 0);
  ctx.restore();
}

function drawFirefly(ctx: CanvasRenderingContext2D, p: Particle, isDark: boolean) {
  const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p.phase * 8));
  const alpha = p.opacity * blink * (isDark ? 1 : 0.7);

  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(255, 241, 150, 1)";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
}

function ensureCanvas() {
  const existing = document.getElementById(CANVAS_ID);
  if (existing instanceof HTMLCanvasElement) return { canvas: existing, created: false };

  const canvas = document.createElement("canvas");
  canvas.id = CANVAS_ID;
  canvas.className = "vp-seasonal-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  return { canvas, created: true };
}

export function initSeasonalEffects() {
  if (typeof window === "undefined") return () => {};
  if (prefersReducedMotion()) return () => {};

  const setting = readSetting();
  if (!setting.enabled) return () => {};

  const season = setting.season ?? getSeasonByMonth(new Date());
  const { canvas, created } = ensureCanvas();

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let isDark = getIsDark();
  const rootObserver = new MutationObserver(() => {
    isDark = getIsDark();
  });
  rootObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"]
  });

  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let stopped = false;

  const particles: Particle[] = [];

  function syncParticles() {
    const desired = targetParticleCount(season, width, height);
    while (particles.length < desired) particles.push(makeParticle(season, width, height));
    if (particles.length > desired) particles.length = desired;
  }

  function resize() {
    width = Math.max(1, Math.round(window.innerWidth));
    height = Math.max(1, Math.round(window.innerHeight));
    dpr = clamp(window.devicePixelRatio ?? 1, 1, MAX_DPR);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    syncParticles();
  }

  function renderFrame() {
    ctx.clearRect(0, 0, width, height);

    if (season === "summer") {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = isDark ? 14 : 10;
      ctx.shadowColor = "rgba(255, 241, 150, 0.55)";
      for (const p of particles) drawFirefly(ctx, p, isDark);
      ctx.restore();
      return;
    }

    for (const p of particles) {
      if (p.kind === "snow") drawSnow(ctx, p, isDark);
      else if (p.kind === "petal") drawPetal(ctx, p, isDark);
      else drawLeafEmoji(ctx, p);
    }

  }

  function tick(now: number) {
    if (stopped) return;

    const dt = clamp(now - lastTime, 0, 50);
    lastTime = now;

    for (const p of particles) updateParticle(p, season, dt, width, height);
    renderFrame();

    raf = window.requestAnimationFrame(tick);
  }

  let lastTime = performance.now();

  const onVisibility = () => {
    if (document.hidden) {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      return;
    }

    if (!raf) {
      lastTime = performance.now();
      raf = window.requestAnimationFrame(tick);
    }
  };

  const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const onMotionChange = () => {
    if (motionQuery?.matches) cleanup();
  };

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  motionQuery?.addEventListener?.("change", onMotionChange);

  resize();
  raf = window.requestAnimationFrame(tick);

  function cleanup() {
    if (stopped) return;
    stopped = true;

    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;

    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    motionQuery?.removeEventListener?.("change", onMotionChange);
    rootObserver.disconnect();

    if (created) canvas.remove();
  }

  return cleanup;
}
