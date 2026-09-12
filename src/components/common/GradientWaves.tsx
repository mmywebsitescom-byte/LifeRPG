import React, { useEffect, useRef } from 'react';
import './GradientWaves.css';

export interface GradientWavesProps {
  color1?: string; // top / background
  color2?: string; // mid wave
  color3?: string; // lower wave / accent
  speed?: number;
  amplitude?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const VS = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_amplitude;
uniform float u_opacity;
uniform vec2 u_mouse;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

float noise(vec2 p) {
  return sin(p.x * 1.3 + p.y * 0.8) * 0.5 + 0.5;
}

float waveHeight(float x, float t, float freq, float amp, float phase) {
  return sin(x * freq + t + phase) * amp
       + sin(x * freq * 1.6 + t * 1.3 + phase * 2.0) * amp * 0.4
       + sin(x * freq * 2.9 + t * 0.7 + phase * 0.5) * amp * 0.2;
}

// Smooth step edge for wave silhouette
float waveMask(float uvy, float waveY, float softness) {
  return smoothstep(waveY - softness, waveY + softness, uvy);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv.y = 1.0 - uv.y; // flip: 0=top, 1=bottom

  float T = u_time * u_speed;
  float amp = u_amplitude * 0.07;

  // Mouse subtle parallax on wave positions
  float mx = (u_mouse.x - 0.5) * 0.03;

  // Wave 1 - upper layer (tallest, darkest)
  float w1 = 0.30 + waveHeight(uv.x + mx, T * 1.0, 2.1, amp, 0.0);
  // Wave 2 - mid layer
  float w2 = 0.52 + waveHeight(uv.x + mx, T * 0.8, 2.8, amp * 0.8, 1.8);
  // Wave 3 - lower layer (smallest)
  float w3 = 0.70 + waveHeight(uv.x + mx, T * 1.2, 3.5, amp * 0.6, 3.5);

  float soft = 0.012;

  // Layer masking from top to bottom
  float above1 = waveMask(uv.y, w1, soft);         // above wave1 = bg top
  float above2 = waveMask(uv.y, w2, soft);          // above wave2
  float above3 = waveMask(uv.y, w3, soft);          // above wave3

  // Start with background (color1 at top)
  vec3 col = u_color1;

  // Wave band 1: darkened color2 silhouette
  col = mix(col, u_color2 * 0.55, above1 * (1.0 - above2 * 0.5));

  // Wave band 2: mid color2
  col = mix(col, u_color2 * 0.78, above2 * (1.0 - above3 * 0.5));

  // Wave band 3: bright color2 → color3
  col = mix(col, mix(u_color2, u_color3, 0.4), above3);

  // Subtle bottom glow from color3
  float bottomGlow = smoothstep(0.6, 1.0, uv.y) * 0.35;
  col = mix(col, u_color3 * 0.6, bottomGlow);

  // Vignette
  float vig = 1.0 - 0.5 * pow(length((uv - 0.5) * vec2(1.2, 1.0)), 2.0);
  col *= vig;

  gl_FragColor = vec4(col, u_opacity);
}
`;

const GradientWaves: React.FC<GradientWavesProps> = ({
  color1 = '#06010f',
  color2 = '#3b0764',
  color3 = '#7c3aed',
  speed = 0.4,
  amplitude = 1.0,
  opacity = 1.0,
  mouseInteraction = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const targetMouseRef = useRef<[number, number]>([0.5, 0.5]);
  const propsRef = useRef({ speed, amplitude, opacity, color1, color2, color3, mouseInteraction });

  useEffect(() => {
    propsRef.current = { speed, amplitude, opacity, color1, color2, color3, mouseInteraction };
  }, [speed, amplitude, opacity, color1, color2, color3, mouseInteraction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) {
      console.warn('GradientWaves: WebGL not supported');
      return;
    }

    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(s));
      }
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs!);
    gl.attachShader(prog, fs!);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uRes    = gl.getUniformLocation(prog, 'u_resolution');
    const uTime   = gl.getUniformLocation(prog, 'u_time');
    const uSpeed  = gl.getUniformLocation(prog, 'u_speed');
    const uAmp    = gl.getUniformLocation(prog, 'u_amplitude');
    const uOp     = gl.getUniformLocation(prog, 'u_opacity');
    const uMouse  = gl.getUniformLocation(prog, 'u_mouse');
    const uC1     = gl.getUniformLocation(prog, 'u_color1');
    const uC2     = gl.getUniformLocation(prog, 'u_color2');
    const uC3     = gl.getUniformLocation(prog, 'u_color3');

    const resize = () => {
      const w = canvas.offsetWidth || 1;
      const h = canvas.offsetHeight || 1;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      if (!propsRef.current.mouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      ];
    };
    const onMouseLeave = () => { targetMouseRef.current = [0.5, 0.5]; };
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const t0 = performance.now();

    const render = (now: number) => {
      resize();
      const p = propsRef.current;
      const t = (now - t0) * 0.001;

      const [mx, my] = mouseRef.current;
      const [tx, ty] = targetMouseRef.current;
      mouseRef.current = [mx + 0.06 * (tx - mx), my + 0.06 * (ty - my)];

      const [r1,g1,b1] = hexToRgb(p.color1);
      const [r2,g2,b2] = hexToRgb(p.color2);
      const [r3,g3,b3] = hexToRgb(p.color3);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uSpeed, p.speed);
      gl.uniform1f(uAmp, p.amplitude);
      gl.uniform1f(uOp, p.opacity);
      gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
      gl.uniform3f(uC1, r1, g1, b1);
      gl.uniform3f(uC2, r2, g2, b2);
      gl.uniform3f(uC3, r3, g3, b3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVis);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`gradient-waves-canvas ${className}`.trim()}
    />
  );
};

export default GradientWaves;
