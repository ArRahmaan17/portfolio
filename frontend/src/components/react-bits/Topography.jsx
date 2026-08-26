/**
 * Topography – WebGL Topographic contour lines background component.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: custom line & bg colors, light/dark mode support, reduced-motion, IntersectionObserver pause.
 *
 * Attribution: reactbits.dev / MIT licence
 */
import { useEffect, useRef, useState, memo } from "react";

const VERT_SRC = `
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uColor;
  uniform vec3  uBgColor;
  uniform float uSpeed;
  uniform float uLinesCount;
  uniform float uDark;

  varying vec2 vUv;

  const vec4 C = vec4(0.2113248654, 0.3660254038, -0.5773502692, 0.0243902439);

  vec3 permute(vec3 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }

  float snoise(vec2 v) {
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.792842914 - 0.8537347209 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
    float t = uTime * uSpeed * 0.0003;

    float n = snoise(st * 2.2 + vec2(t * 0.4, t * 0.25)) * 0.5 + 0.5;
    n += snoise(st * 4.5 - vec2(t * 0.15, t * 0.35)) * 0.25;

    float lines = sin(n * uLinesCount * 3.14159);
    float lineMask = pow(clamp(1.0 - abs(lines), 0.0, 1.0), 7.0);

    float alpha = mix(0.2, 0.45, uDark);
    vec3 finalColor = mix(uBgColor, uColor, lineMask * alpha);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function hexToRgb(hex) {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c, 16);
  return [(num >> 16) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function compileShader(gl, type, src) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    if (log) console.warn("Topography shader compile log:", log);
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function createProgram(gl, vertSrc, fragSrc) {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    if (log) console.warn("Topography program link log:", log);
    gl.deleteProgram(prog);
    return null;
  }
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return prog;
}

function StaticFallback({ isDark }) {
  return (
    <div
      className="absolute inset-0 bg-signal-field transition-opacity duration-700"
      style={{ opacity: isDark ? 0.9 : 0.4 }}
      aria-hidden="true"
    />
  );
}

function TopographyCanvas({
  color,
  bgColor,
  speed,
  linesCount,
  isDark,
}) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const runRef    = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;
    try {
      gl =
        canvas.getContext("webgl", { alpha: false, antialias: true }) ||
        canvas.getContext("experimental-webgl", { alpha: false });
    } catch (e) {
      setFailed(true);
      return;
    }

    if (!gl) {
      setFailed(true);
      return;
    }

    const program = createProgram(gl, VERT_SRC, FRAG_SRC);
    if (!program) {
      setFailed(true);
      return;
    }

    const buf = gl.createBuffer();
    if (!buf) {
      setFailed(true);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const posLoc      = gl.getAttribLocation(program, "a_position");
    const timeLoc     = gl.getUniformLocation(program, "uTime");
    const resLoc      = gl.getUniformLocation(program, "uResolution");
    const colorLoc    = gl.getUniformLocation(program, "uColor");
    const bgColorLoc  = gl.getUniformLocation(program, "uBgColor");
    const speedLoc    = gl.getUniformLocation(program, "uSpeed");
    const linesLoc    = gl.getUniformLocation(program, "uLinesCount");
    const darkLoc     = gl.getUniformLocation(program, "uDark");

    const resize = () => {
      canvas.width  = canvas.clientWidth || 300;
      canvas.height = canvas.clientHeight || 150;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    let start = null;
    const tick = (ts) => {
      if (!runRef.current) return;
      if (!start) start = ts;
      const t = ts - start;

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLoc, t);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform3fv(colorLoc, new Float32Array(hexToRgb(color)));
      gl.uniform3fv(bgColorLoc, new Float32Array(hexToRgb(bgColor)));
      gl.uniform1f(speedLoc, speed);
      gl.uniform1f(linesLoc, linesCount);
      gl.uniform1f(darkLoc, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      runRef.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafRef.current);
      }
    });
    observer.observe(canvas);

    return () => {
      runRef.current = false;
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      try {
        gl.deleteProgram(program);
        gl.deleteBuffer(buf);
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      } catch (e) {}
    };
  }, [color, bgColor, speed, linesCount, isDark]);

  if (failed) {
    return <StaticFallback isDark={isDark} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function Topography({
  color = "#55E6FF",
  bgColor = "#050816",
  speed = 0.8,
  linesCount = 18.0,
  isDark = false,
  children,
  className = "",
}) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const useWebGL = !prefersReducedMotion && !isCoarsePointer;

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {useWebGL ? (
        <TopographyCanvas
          color={color}
          bgColor={bgColor}
          speed={speed}
          linesCount={linesCount}
          isDark={isDark}
        />
      ) : (
        <StaticFallback isDark={isDark} />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

export default memo(Topography);
