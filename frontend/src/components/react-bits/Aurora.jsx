/**
 * Aurora – WebGL Soft Aurora mesh gradient backdrop.
 * Vendored from React Bits (free JS/Tailwind variant).
 * Modified for: custom colorStops, light/dark mode support, reduced-motion, IntersectionObserver pause.
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
  uniform vec3  uColorStops[3];
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uBlend;
  uniform float uDark;

  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
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
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * uSpeed * 0.0004;

    float n1 = snoise(uv * 1.8 + vec2(time * 0.7, time * 0.4));
    float n2 = snoise(uv * 2.5 - vec2(time * 0.3, time * 0.6));

    float wave  = sin(uv.x * 5.0 + n1 * uAmplitude + time) * 0.5 + 0.5;
    float wave2 = cos(uv.y * 3.5 + n2 * uAmplitude - time * 0.7) * 0.5 + 0.5;

    float factor = mix(wave, wave2, 0.5);

    vec3 col = mix(uColorStops[0], uColorStops[1], factor);
    col = mix(col, uColorStops[2], sin(factor * 3.14159) * uBlend);

    // Alpha intensity & dark/light surface integration
    float alpha = mix(0.15, 0.45, uDark) * (0.6 + 0.4 * factor);
    vec3 bg = mix(vec3(0.97, 0.98, 0.99), vec3(0.02, 0.03, 0.08), uDark);

    gl_FragColor = vec4(mix(bg, col, alpha), 1.0);
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
    console.warn("Aurora shader compile log:", gl.getShaderInfoLog(sh));
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
    console.warn("Aurora program link log:", gl.getProgramInfoLog(prog));
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

function AuroraCanvas({
  colorStops,
  speed,
  amplitude,
  blend,
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

    const posLoc   = gl.getAttribLocation(program, "a_position");
    const timeLoc  = gl.getUniformLocation(program, "uTime");
    const resLoc   = gl.getUniformLocation(program, "uResolution");
    const stopsLoc = gl.getUniformLocation(program, "uColorStops");
    const speedLoc = gl.getUniformLocation(program, "uSpeed");
    const ampLoc   = gl.getUniformLocation(program, "uAmplitude");
    const blendLoc = gl.getUniformLocation(program, "uBlend");
    const darkLoc  = gl.getUniformLocation(program, "uDark");

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

      const rgbArray = new Float32Array([
        ...hexToRgb(colorStops[0]),
        ...hexToRgb(colorStops[1]),
        ...hexToRgb(colorStops[2]),
      ]);
      gl.uniform3fv(stopsLoc, rgbArray);

      gl.uniform1f(speedLoc, speed);
      gl.uniform1f(ampLoc, amplitude);
      gl.uniform1f(blendLoc, blend);
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
  }, [colorStops, speed, amplitude, blend, isDark]);

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

function Aurora({
  colorStops = ["#55E6FF", "#8B5CF6", "#D946EF"],
  speed = 1.0,
  amplitude = 1.0,
  blend = 0.8,
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
        <AuroraCanvas
          colorStops={colorStops}
          speed={speed}
          amplitude={amplitude}
          blend={blend}
          isDark={isDark}
        />
      ) : (
        <StaticFallback isDark={isDark} />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

export default memo(Aurora);
