/**
 * DarkVeil – WebGL signal-field hero backdrop.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: theme tokens, reduced-motion, IntersectionObserver pause.
 * Uses raw WebGL with mediump precision fallback & graceful error state.
 *
 * Attribution: reactbits.dev  /  MIT licence
 */
import { useEffect, useRef, useState, memo } from "react";

const VERT_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform float u_dark;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 pi = floor(p);
    vec2 pf = fract(p);
    vec2 uu = pf * pf * (3.0 - 2.0 * pf);
    float a = hash(pi);
    float b = hash(pi + vec2(1.0, 0.0));
    float c = hash(pi + vec2(0.0, 1.0));
    float d = hash(pi + vec2(1.0, 1.0));
    return mix(mix(a, b, uu.x), mix(c, d, uu.x), uu.y);
  }

  float fbm(vec2 p) {
    vec2  q   = p;
    float val = 0.0;
    float amp = 0.5;
    val += amp * noise(q); q *= 2.1; amp *= 0.5;
    val += amp * noise(q); q *= 2.1; amp *= 0.5;
    val += amp * noise(q); q *= 2.1; amp *= 0.5;
    val += amp * noise(q); q *= 2.1; amp *= 0.5;
    val += amp * noise(q);
    return val;
  }

  void main() {
    vec2  uv   = gl_FragCoord.xy / u_resolution;
    float t    = u_time * 0.18;
    float n    = fbm(uv * 2.5 + t);
    float n2   = fbm(uv * 4.0 - t * 0.7 + 7.3);

    vec3 ion    = vec3(0.333, 0.902, 1.0);
    vec3 elec   = vec3(0.545, 0.361, 0.965);
    vec3 plasma = vec3(0.851, 0.275, 0.937);

    vec3  col   = mix(mix(ion, elec, n), plasma, n2 * 0.4);
    float base  = mix(0.96, 0.03, u_dark);
    float alpha = mix(0.05, 0.18, u_dark) * (n * 0.6 + n2 * 0.4);

    gl_FragColor = vec4(mix(vec3(base), col, u_dark * 0.9 + 0.05), alpha);
  }
`;

function compileShader(gl, type, src) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    console.warn("DarkVeil shader compile info:", log);
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
    console.warn("DarkVeil program link info:", gl.getProgramInfoLog(prog));
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
      className="absolute inset-0 bg-signal-field"
      style={{ opacity: isDark ? 1 : 0.4 }}
      aria-hidden="true"
    />
  );
}

function DarkVeilCanvas({ isDark }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const runRef    = useRef(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;
    try {
      gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) ||
           canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false });
    } catch (e) {
      setWebglFailed(true);
      return;
    }

    if (!gl) {
      setWebglFailed(true);
      return;
    }

    const program = createProgram(gl, VERT_SRC, FRAG_SRC);
    if (!program) {
      setWebglFailed(true);
      return;
    }

    /* Full-screen triangle */
    const buf = gl.createBuffer();
    if (!buf) {
      setWebglFailed(true);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  3, -1, -1,  3]),
      gl.STATIC_DRAW
    );

    const posLoc  = gl.getAttribLocation(program, "a_position");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc  = gl.getUniformLocation(program, "u_resolution");
    const drkLoc  = gl.getUniformLocation(program, "u_dark");

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
      const t = (ts - start) / 1000;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLoc, t);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(drkLoc, isDark ? 1.0 : 0.0);

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
  }, [isDark]);

  if (webglFailed) {
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

function DarkVeil({ isDark = false, children, className = "" }) {
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
        <DarkVeilCanvas isDark={isDark} />
      ) : (
        <StaticFallback isDark={isDark} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default memo(DarkVeil);
