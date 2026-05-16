import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * DepthGlobe — Integrated Portfolio Version
 * Optimized for performance and stability.
 */

interface DepthGlobeProps {
  size?: number;
  className?: string;
}

export default function DepthGlobe({ size = 560, className = "" }: DepthGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth  || size;
    const H = mount.clientHeight || size;

    let renderer: THREE.WebGLRenderer, 
        scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        globe: THREE.Group, 
        particles: THREE.Points, 
        glowMat: THREE.ShaderMaterial, 
        animId: number;
    let isCanvas2D = false;

    // ─── 1. Robust WebGL Detection ──────────────────────────────────────────
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true, 
        failIfMajorPerformanceCaveat: false,
        powerPreference: "high-performance"
      });
      
      if (!renderer.getContext()) throw new Error("No WebGL Context");
      
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      scene  = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
      camera.position.set(0, 0, 4.2);

      globe = new THREE.Group();
      scene.add(globe);

      // Core
      globe.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x05070f })
      ));
      
      // Gold Atmosphere Glow
      glowMat = new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color(0x7a5a14) }, dragGlow: { value: 0.0 } },
        vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 color; uniform float dragGlow; varying vec3 vNormal; void main() { float intensity = pow(max(0.0, 0.6 - dot(vNormal, vec3(0,0,1))), 4.0); gl_FragColor = vec4(color, intensity * (0.8 + dragGlow * 0.5)); }`,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true,
      });
      globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 32), glowMat));

      // Particles
      particles = buildParticles(THREE);
      globe.add(particles);
      
      setStatus("Mode: WebGL 3D");
    } catch (e) {
      console.error("WebGL Error:", e);
      isCanvas2D = true;
    }

    // ─── 2. Canvas2D Fallback ───────────────────────────────────────────────
    let ctx2d: CanvasRenderingContext2D | null = null;
    let points3d: any[] = [];
    if (isCanvas2D) {
      const canvas = document.createElement("canvas");
      canvas.width = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      mount.appendChild(canvas);
      ctx2d = canvas.getContext("2d");
      
      const seeds = getContinentData();
      seeds.forEach(s => {
        const n = Math.round(12 * (s.r / 10));
        for(let i=0; i<n; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = s.r * Math.sqrt(Math.random()) * 0.9;
          const lat = s.lat + Math.cos(angle) * dist;
          const lon = s.lon + Math.sin(angle) * dist / Math.cos(s.lat * (Math.PI/180) + 0.01);
          const phi = (90 - lat) * (Math.PI/180);
          const theta = (lon + 180) * (Math.PI/180);
          const r = 1.02 + Math.random() * 0.05;
          points3d.push({
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.cos(phi),
            z: r * Math.sin(phi) * Math.sin(theta),
            s: 1.5 + Math.random() * 2 
          });
        }
      });
      setStatus("Mode: Canvas 2D (Fallback)");
    }

    // ─── 3. Shared Logic ────────────────────────────────────────────────────
    const st = {
      drag: false, px: 0, py: 0, vx: 0, vy: 0,
      rotX: 0.3, rotY: 0, autoRotate: true,
      glowTarget: 0, glowCurrent: 0
    };

    const startDrag = (x: number, y: number) => { st.drag = true; st.autoRotate = false; st.glowTarget = 1; st.px = x; st.py = y; mount.style.cursor = "grabbing"; };
    const moveDrag = (x: number, y: number) => { if (!st.drag) return; const dx = x - st.px, dy = y - st.py; st.rotY += dx * 0.007; st.rotX = Math.max(-1.4, Math.min(1.4, st.rotX + dy * 0.007)); st.px = x; st.py = y; };
    const endDrag = () => { st.drag = false; st.glowTarget = 0; mount.style.cursor = "grab"; setTimeout(() => { st.autoRotate = true; }, 2000); };

    const onMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();

    const onTouchStart = (e: TouchEvent) => { 
      if (e.touches[0]) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY); 
      }
    };
    const onTouchMove = (e: TouchEvent) => { 
      if (e.touches[0]) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY); 
      }
    };
    const onTouchEnd = () => endDrag();

    // Keyboard support for accessibility
    const onKeyDown = (e: KeyboardEvent) => {
      st.autoRotate = false;
      if (e.key === "ArrowLeft") st.rotY -= 0.1;
      if (e.key === "ArrowRight") st.rotY += 0.1;
      if (e.key === "ArrowUp") st.rotX = Math.min(1.4, st.rotX + 0.1);
      if (e.key === "ArrowDown") st.rotX = Math.max(-1.4, st.rotX - 0.1);
      setTimeout(() => { st.autoRotate = true; }, 3000);
    };

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("touchstart", onTouchStart, { passive: false });
    mount.addEventListener("touchmove", onTouchMove, { passive: false });
    mount.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);

    // Handle Resize
    const handleResize = () => {
      const nW = mount.clientWidth;
      const nH = mount.clientHeight;
      if (!isCanvas2D && renderer) {
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
      } else if (ctx2d) {
        ctx2d.canvas.width = nW * window.devicePixelRatio;
        ctx2d.canvas.height = nH * window.devicePixelRatio;
      }
    };
    window.addEventListener("resize", handleResize);

    const tick = () => {
      animId = requestAnimationFrame(tick);
      st.glowCurrent += (st.glowTarget - st.glowCurrent) * 0.08; 
      if (st.autoRotate) st.rotY += 0.002;

      if (!isCanvas2D && renderer) {
        globe.rotation.x = st.rotX;
        globe.rotation.y = st.rotY;
        if (particles && particles.material instanceof THREE.ShaderMaterial) {
          particles.material.uniforms.dragGlow.value = st.glowCurrent;
        }
        if (glowMat && glowMat.uniforms) {
          glowMat.uniforms.dragGlow.value = st.glowCurrent;
        }
        renderer.render(scene, camera);
      } else if (ctx2d) {
        const dpr = window.devicePixelRatio;
        ctx2d.clearRect(0, 0, W * dpr, H * dpr);
        const cx = (W * dpr) / 2, cy = (H * dpr) / 2, scale = W * dpr * 0.42;
        const cX = Math.cos(st.rotX), sX = Math.sin(st.rotX), cY = Math.cos(st.rotY), sY = Math.sin(st.rotY);

        // Gold Atmosphere Glow
        const g = ctx2d.createRadialGradient(cx, cy, scale * 0.8, cx, cy, scale * 1.35);
        g.addColorStop(0, "rgba(122, 90, 20, 0)");
        g.addColorStop(1, `rgba(201, 168, 76, ${0.15 + st.glowCurrent * 0.25})`);
        ctx2d.fillStyle = g; ctx2d.fillRect(0, 0, W * dpr, H * dpr);

        ctx2d.fillStyle = "#c9a84c"; // Gold dots
        points3d.forEach((p, i) => {
          const isExtra = i % 3 === 0;
          const visibility = isExtra ? st.glowCurrent : 1.0;
          if (visibility < 0.05) return;

          let x = p.x * cY - p.z * sY;
          let z = p.x * sY + p.z * cY;
          let y = p.y * cX - z * sX;
          let zf = p.y * sX + z * cX;
          
          if (zf > -0.5) {
            const f = scale / (zf + 4.2);
            ctx2d.globalAlpha = Math.max(0, (zf + 1) / 2) * (0.6 + st.glowCurrent * 0.4) * visibility;
            const s = p.s * f * 0.018 * (1 + st.glowCurrent * 0.8);
            ctx2d.beginPath();
            ctx2d.arc(cx + x * f, cy - y * f, s, 0, 7);
            ctx2d.fill();
          }
        });
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove", onTouchMove);
      mount.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", handleResize);
      if (renderer) { renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); }
      if (ctx2d) { if (mount.contains(ctx2d.canvas)) mount.removeChild(ctx2d.canvas); }
    };
  }, [size]);

  return (
    <div className={className} style={{ position: "relative", width: "100%", maxWidth: size, aspectRatio: "1/1" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab", touchAction: "none" }} />
    </div>
  );
}

function buildParticles(THREE: any) {
  // 1. Create a Gold radial dot texture
  const cv = document.createElement("canvas");
  cv.width = 64; cv.height = 64;
  const cx = cv.getContext("2d")!;
  const g = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0.0, "rgba(255, 235, 180, 1.0)");
  g.addColorStop(0.4, "rgba(201, 168, 76, 1.0)"); // Core gold color
  g.addColorStop(1.0, "rgba(201, 168, 76, 0.0)");
  cx.fillStyle = g; cx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(cv);

  const pos: number[] = [];
  const extra: number[] = [];
  const seeds = getContinentData();
  seeds.forEach(s => {
    const count = 35;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 6.28, dist = s.r * Math.sqrt(Math.random()) * 0.95;
      const lat = s.lat + Math.cos(angle) * dist, lon = s.lon + Math.sin(angle) * dist / Math.cos(s.lat * 0.0174 + 0.01);
      const phi = (90 - lat) * 0.0174, theta = (lon + 180) * 0.0174, r = 1.02 + Math.random() * 0.06;
      pos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
      extra.push(Math.random());
    }
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("extra", new THREE.Float32BufferAttribute(extra, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { tex: { value: tex }, dragGlow: { value: 0.0 } },
    vertexShader: `
      attribute float extra;
      varying float vAlpha;
      uniform float dragGlow;
      void main() {
        float density = step(0.4 * (1.0 - dragGlow), extra);
        vAlpha = density * (0.9 + dragGlow * 0.4);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (2.4 + dragGlow * 2.2) * density;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform sampler2D tex;
      varying float vAlpha;
      void main() {
        vec4 t = texture2D(tex, gl_PointCoord);
        if (t.a < 0.1) discard;
        // Use the gold texture directly
        gl_FragColor = vec4(t.rgb, t.a * vAlpha * 1.3);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geo, mat);
}

function getContinentData() {
  return [
    {lat:71,lon:-156,r:8},{lat:68,lon:-162,r:7},{lat:65,lon:-168,r:6},
    {lat:64,lon:-153,r:9},{lat:62,lon:-150,r:8},{lat:60,lon:-148,r:7},
    {lat:58,lon:-136,r:7},{lat:57,lon:-134,r:6},
    {lat:70,lon:-130,r:12},{lat:68,lon:-120,r:14},{lat:65,lon:-110,r:14},
    {lat:62,lon:-118,r:12},{lat:60,lon:-112,r:13},{lat:58,lon:-122,r:10},
    {lat:55,lon:-128,r:8},{lat:52,lon:-126,r:7},
    {lat:68,lon:-100,r:16},{lat:65,lon:-90,r:14},{lat:62,lon:-95,r:14},
    {lat:60,lon:-98,r:14},{lat:58,lon:-100,r:13},{lat:55,lon:-108,r:12},
    {lat:53,lon:-100,r:13},{lat:50,lon:-96,r:12},
    {lat:62,lon:-75,r:12},{lat:58,lon:-78,r:12},{lat:55,lon:-76,r:11},
    {lat:52,lon:-72,r:10},{lat:50,lon:-66,r:9},{lat:48,lon:-58,r:7},
    {lat:47,lon:-62,r:7},{lat:46,lon:-85,r:10},{lat:44,lon:-80,r:9},
    {lat:48,lon:-122,r:7},{lat:46,lon:-120,r:7},{lat:44,lon:-120,r:7},
    {lat:42,lon:-120,r:8},{lat:40,lon:-121,r:7},{lat:38,lon:-120,r:7},
    {lat:36,lon:-118,r:7},{lat:34,lon:-117,r:6},{lat:32,lon:-116,r:5},
    {lat:48,lon:-110,r:10},{lat:46,lon:-108,r:11},{lat:44,lon:-106,r:12},
    {lat:42,lon:-108,r:12},{lat:40,lon:-106,r:13},{lat:38,lon:-104,r:12},
    {lat:36,lon:-102,r:11},{lat:34,lon:-100,r:11},{lat:32,lon:-100,r:10},
    {lat:30,lon:-98,r:10},{lat:28,lon:-100,r:9},
    {lat:48,lon:-96,r:10},{lat:46,lon:-94,r:10},{lat:44,lon:-90,r:10},
    {lat:42,lon:-87,r:9},{lat:42,lon:-78,r:8},{lat:40,lon:-76,r:8},
    {lat:38,lon:-78,r:8},{lat:36,lon:-80,r:7},{lat:34,lon:-84,r:7},
    {lat:32,lon:-86,r:7},{lat:30,lon:-88,r:8},{lat:30,lon:-84,r:7},
    {lat:28,lon:-82,r:6},{lat:26,lon:-80,r:5},{lat:25,lon:-80,r:4},
    {lat:30,lon:-108,r:8},{lat:28,lon:-106,r:8},{lat:26,lon:-104,r:8},
    {lat:24,lon:-102,r:8},{lat:22,lon:-100,r:8},{lat:20,lon:-102,r:7},
    {lat:20,lon:-98,r:7},{lat:18,lon:-96,r:6},{lat:19,lon:-99,r:5},
    {lat:83,lon:-40,r:8},{lat:80,lon:-35,r:10},{lat:78,lon:-30,r:9},
    {lat:76,lon:-38,r:11},{lat:74,lon:-42,r:12},{lat:72,lon:-40,r:12},
    {lat:70,lon:-46,r:11},{lat:68,lon:-50,r:10},{lat:66,lon:-46,r:9},
    {lat:64,lon:-43,r:8},{lat:62,lon:-44,r:7},
    {lat:16,lon:-90,r:4},{lat:14,lon:-88,r:4},{lat:12,lon:-86,r:4},
    {lat:10,lon:-84,r:4},{lat:9,lon:-80,r:3},{lat:8,lon:-78,r:3},
    {lat:21,lon:-80,r:5},{lat:20,lon:-76,r:4},{lat:19,lon:-70,r:4},
    {lat:18,lon:-66,r:3},{lat:18,lon:-73,r:4},
    {lat:10,lon:-72,r:7},{lat:8,lon:-68,r:8},{lat:6,lon:-62,r:7},
    {lat:4,lon:-58,r:7},{lat:6,lon:-75,r:7},{lat:4,lon:-72,r:8},
    {lat:2,lon:-52,r:9},{lat:0,lon:-50,r:9},{lat:-2,lon:-52,r:10},
    {lat:-4,lon:-56,r:11},{lat:-2,lon:-60,r:11},{lat:0,lon:-65,r:10},
    {lat:-4,lon:-62,r:12},{lat:-6,lon:-58,r:11},{lat:-5,lon:-68,r:11},
    {lat:-8,lon:-72,r:12},{lat:-10,lon:-66,r:12},{lat:-10,lon:-58,r:11},
    {lat:-12,lon:-50,r:11},{lat:-14,lon:-52,r:11},{lat:-15,lon:-58,r:12},
    {lat:-16,lon:-50,r:10},{lat:-18,lon:-52,r:10},{lat:-20,lon:-48,r:9},
    {lat:-22,lon:-46,r:9},{lat:-22,lon:-52,r:9},{lat:-24,lon:-50,r:8},
    {lat:-26,lon:-52,r:8},{lat:-28,lon:-52,r:8},{lat:-30,lon:-54,r:9},
    {lat:-4,lon:-78,r:8},{lat:-6,lon:-78,r:8},{lat:-8,lon:-76,r:8},
    {lat:-10,lon:-76,r:8},{lat:-12,lon:-76,r:7},{lat:-14,lon:-74,r:7},
    {lat:-16,lon:-72,r:7},{lat:-18,lon:-70,r:6},{lat:-0,lon:-78,r:5},
    {lat:-2,lon:-78,r:6},{lat:-22,lon:-64,r:8},{lat:-24,lon:-64,r:8},
    {lat:-26,lon:-60,r:9},{lat:-28,lon:-58,r:9},{lat:-30,lon:-60,r:9},
    {lat:-32,lon:-62,r:9},{lat:-34,lon:-62,r:9},{lat:-36,lon:-62,r:8},
    {lat:-38,lon:-64,r:8},{lat:-40,lon:-66,r:8},{lat:-42,lon:-68,r:7},
    {lat:-44,lon:-68,r:7},{lat:-46,lon:-70,r:6},{lat:-48,lon:-72,r:6},
    {lat:-50,lon:-72,r:5},{lat:-52,lon:-72,r:5},{lat:-54,lon:-68,r:4},
    {lat:-28,lon:-70,r:4},{lat:-32,lon:-70,r:4},{lat:-36,lon:-72,r:4},
    {lat:-40,lon:-72,r:4},{lat:-44,lon:-72,r:3},
    {lat:57,lon:-4,r:5},{lat:55,lon:-3,r:5},{lat:53,lon:-2,r:5},
    {lat:51,lon:-1,r:5},{lat:54,lon:-7,r:5},{lat:48,lon:2,r:7},
    {lat:46,lon:2,r:6},{lat:50,lon:4,r:6},{lat:52,lon:5,r:6},
    {lat:52,lon:10,r:7},{lat:50,lon:8,r:7},{lat:48,lon:8,r:7},
    {lat:47,lon:6,r:6},{lat:44,lon:2,r:6},{lat:43,lon:5,r:5},
    {lat:40,lon:-4,r:7},{lat:38,lon:-6,r:7},{lat:36,lon:-5,r:6},
    {lat:42,lon:-8,r:6},{lat:40,lon:-8,r:6},{lat:38,lon:-8,r:5},
    {lat:43,lon:-2,r:5},{lat:41,lon:1,r:5},
    {lat:58,lon:5,r:5},{lat:60,lon:8,r:6},{lat:62,lon:10,r:7},
    {lat:64,lon:14,r:8},{lat:66,lon:16,r:8},{lat:68,lon:18,r:8},
    {lat:70,lon:24,r:7},{lat:70,lon:28,r:6},{lat:68,lon:27,r:7},
    {lat:65,lon:26,r:8},{lat:62,lon:26,r:7},{lat:60,lon:24,r:6},
    {lat:58,lon:26,r:6},{lat:56,lon:14,r:6},{lat:58,lon:15,r:5},
    {lat:52,lon:18,r:8},{lat:50,lon:18,r:7},{lat:50,lon:15,r:6},
    {lat:48,lon:16,r:6},{lat:47,lon:18,r:6},
    {lat:45,lon:10,r:6},{lat:43,lon:12,r:5},{lat:41,lon:14,r:5},
    {lat:39,lon:16,r:4},{lat:38,lon:14,r:3},{lat:37,lon:14,r:3},
    {lat:46,lon:18,r:6},{lat:44,lon:20,r:6},{lat:42,lon:22,r:6},
    {lat:40,lon:22,r:5},{lat:38,lon:22,r:4},{lat:38,lon:24,r:4},
    {lat:56,lon:26,r:7},{lat:53,lon:28,r:8},{lat:51,lon:32,r:8},
    {lat:49,lon:32,r:8},{lat:48,lon:36,r:7},{lat:50,lon:36,r:7},
    {lat:46,lon:24,r:7},{lat:44,lon:26,r:7},
    {lat:34,lon:2,r:9},{lat:32,lon:6,r:10},{lat:30,lon:10,r:11},
    {lat:28,lon:2,r:12},{lat:26,lon:6,r:12},{lat:24,lon:10,r:13},
    {lat:22,lon:14,r:13},{lat:20,lon:8,r:12},{lat:18,lon:2,r:11},
    {lat:20,lon:18,r:12},{lat:30,lon:20,r:8},{lat:30,lon:28,r:6},
    {lat:28,lon:30,r:5},{lat:26,lon:32,r:5},{lat:24,lon:33,r:5},
    {lat:22,lon:33,r:6},{lat:34,lon:10,r:7},{lat:36,lon:8,r:6},
    {lat:16,lon:-16,r:6},{lat:14,lon:-14,r:7},{lat:12,lon:-10,r:8},
    {lat:10,lon:-8,r:8},{lat:8,lon:-4,r:8},{lat:6,lon:-2,r:7},
    {lat:8,lon:2,r:7},{lat:6,lon:4,r:7},{lat:5,lon:8,r:6},
    {lat:10,lon:-14,r:6},{lat:12,lon:-16,r:5},
    {lat:6,lon:14,r:10},{lat:4,lon:18,r:11},{lat:2,lon:22,r:12},
    {lat:0,lon:24,r:12},{lat:-2,lon:20,r:12},{lat:-4,lon:24,r:11},
    {lat:-6,lon:20,r:11},{lat:-4,lon:16,r:10},{lat:2,lon:14,r:9},
    {lat:12,lon:44,r:7},{lat:10,lon:40,r:8},{lat:8,lon:38,r:8},
    {lat:6,lon:40,r:8},{lat:4,lon:38,r:8},{lat:2,lon:36,r:9},
    {lat:0,lon:36,r:9},{lat:-2,lon:36,r:9},{lat:-4,lon:38,r:8},
    {lat:-6,lon:38,r:8},{lat:-8,lon:38,r:7},{lat:-10,lon:38,r:7},
    {lat:-12,lon:30,r:10},{lat:-14,lon:28,r:11},{lat:-16,lon:26,r:11},
    {lat:-18,lon:24,r:10},{lat:-20,lon:28,r:10},{lat:-22,lon:30,r:9},
    {lat:-24,lon:30,r:9},{lat:-26,lon:28,r:9},{lat:-28,lon:26,r:8},
    {lat:-30,lon:24,r:8},{lat:-32,lon:22,r:7},{lat:-34,lon:20,r:6},
    {lat:-34,lon:18,r:5},
    {lat:-14,lon:48,r:5},{lat:-18,lon:46,r:6},{lat:-22,lon:44,r:5},
    {lat:38,lon:36,r:7},{lat:36,lon:38,r:7},{lat:36,lon:36,r:6},
    {lat:34,lon:38,r:6},{lat:32,lon:36,r:5},{lat:30,lon:36,r:5},
    {lat:24,lon:46,r:8},{lat:22,lon:42,r:7},{lat:20,lon:44,r:7},
    {lat:18,lon:44,r:6},{lat:16,lon:44,r:5},{lat:15,lon:48,r:5},
    {lat:24,lon:54,r:5},{lat:26,lon:50,r:5},{lat:28,lon:48,r:5},
    {lat:30,lon:48,r:5},{lat:32,lon:46,r:6},{lat:34,lon:44,r:6},
    {lat:36,lon:44,r:6},{lat:38,lon:44,r:6},
    {lat:52,lon:56,r:10},{lat:50,lon:60,r:10},{lat:48,lon:58,r:10},
    {lat:46,lon:62,r:10},{lat:44,lon:60,r:10},{lat:42,lon:64,r:9},
    {lat:40,lon:62,r:9},{lat:38,lon:66,r:8},{lat:36,lon:64,r:8},
    {lat:38,lon:58,r:7},{lat:36,lon:58,r:7},{lat:38,lon:48,r:8},
    {lat:36,lon:52,r:8},{lat:34,lon:50,r:8},{lat:32,lon:52,r:8},
    {lat:30,lon:54,r:8},
    {lat:66,lon:36,r:10},{lat:64,lon:44,r:11},{lat:62,lon:52,r:12},
    {lat:58,lon:56,r:12},{lat:56,lon:60,r:12},{lat:60,lon:68,r:13},
    {lat:64,lon:78,r:14},{lat:68,lon:90,r:16},{lat:70,lon:100,r:16},
    {lat:68,lon:110,r:14},{lat:65,lon:118,r:13},{lat:70,lon:128,r:12},
    {lat:68,lon:138,r:11},{lat:65,lon:148,r:10},{lat:62,lon:152,r:11},
    {lat:60,lon:148,r:11},{lat:58,lon:140,r:12},{lat:54,lon:136,r:11},
    {lat:56,lon:122,r:13},{lat:58,lon:112,r:14},{lat:56,lon:100,r:15},
    {lat:54,lon:88,r:14},{lat:52,lon:80,r:13},{lat:54,lon:72,r:12},
    {lat:56,lon:68,r:11},{lat:58,lon:60,r:11},{lat:60,lon:52,r:10},
    {lat:68,lon:170,r:9},{lat:65,lon:175,r:7},
    {lat:76,lon:20,r:6},{lat:78,lon:18,r:5},{lat:78,lon:50,r:7},
    {lat:74,lon:60,r:6},{lat:76,lon:100,r:8},{lat:74,lon:130,r:7},
    {lat:32,lon:76,r:8},{lat:30,lon:78,r:8},{lat:28,lon:78,r:9},
    {lat:26,lon:80,r:9},{lat:24,lon:82,r:9},{lat:22,lon:82,r:9},
    {lat:20,lon:80,r:10},{lat:18,lon:78,r:9},{lat:16,lon:80,r:8},
    {lat:14,lon:78,r:7},{lat:12,lon:78,r:6},{lat:10,lon:78,r:5},
    {lat:8,lon:78,r:5},{lat:22,lon:88,r:7},{lat:24,lon:86,r:7},
    {lat:26,lon:86,r:7},{lat:28,lon:84,r:7},
    {lat:48,lon:120,r:12},{lat:46,lon:114,r:13},{lat:44,lon:118,r:13},
    {lat:42,lon:112,r:12},{lat:40,lon:108,r:12},{lat:38,lon:106,r:12},
    {lat:36,lon:106,r:12},{lat:34,lon:108,r:12},{lat:32,lon:110,r:12},
    {lat:30,lon:112,r:11},{lat:28,lon:114,r:10},{lat:26,lon:110,r:10},
    {lat:24,lon:108,r:9},{lat:22,lon:110,r:8},{lat:24,lon:116,r:8},
    {lat:26,lon:118,r:7},{lat:28,lon:120,r:7},{lat:30,lon:120,r:7},
    {lat:34,lon:86,r:10},{lat:32,lon:90,r:10},{lat:30,lon:88,r:9},
    {lat:30,lon:94,r:9},{lat:28,lon:92,r:8},
    {lat:24,lon:98,r:7},{lat:22,lon:102,r:7},{lat:20,lon:102,r:7},
    {lat:18,lon:104,r:6},{lat:16,lon:105,r:6},{lat:14,lon:104,r:6},
    {lat:12,lon:104,r:5},{lat:10,lon:104,r:5},
    {lat:8,lon:100,r:4},{lat:6,lon:102,r:4},{lat:4,lon:102,r:4},
    {lat:2,lon:104,r:4},{lat:3,lon:102,r:3},
    {lat:20,lon:96,r:7},{lat:18,lon:96,r:7},{lat:16,lon:97,r:6},
    {lat:4,lon:98,r:5},{lat:2,lon:100,r:6},{lat:0,lon:102,r:6},
    {lat:-2,lon:104,r:5},{lat:-4,lon:104,r:4},
    {lat:4,lon:114,r:8},{lat:2,lon:115,r:8},{lat:0,lon:115,r:8},
    {lat:-2,lon:113,r:7},{lat:0,lon:110,r:7},{lat:2,lon:112,r:7},
    {lat:-6,lon:107,r:4},{lat:-7,lon:110,r:4},{lat:-7,lon:112,r:3},
    {lat:0,lon:122,r:5},{lat:-2,lon:122,r:5},{lat:-4,lon:122,r:4},
    {lat:-4,lon:136,r:8},{lat:-4,lon:140,r:7},{lat:-6,lon:144,r:6},
    {lat:-6,lon:148,r:5},{lat:-8,lon:146,r:5},
    {lat:18,lon:122,r:5},{lat:16,lon:120,r:5},{lat:14,lon:120,r:5},
    {lat:12,lon:122,r:5},{lat:10,lon:124,r:4},{lat:8,lon:126,r:4},
    {lat:42,lon:142,r:5},{lat:40,lon:140,r:5},{lat:38,lon:140,r:5},
    {lat:36,lon:138,r:5},{lat:34,lon:136,r:4},{lat:33,lon:132,r:4},
    {lat:32,lon:130,r:4},{lat:34,lon:130,r:4},{lat:38,lon:128,r:4},
    {lat:36,lon:128,r:4},{lat:37,lon:127,r:4},{lat:35,lon:129,r:3},
    {lat:24,lon:121,r:3},{lat:22,lon:120,r:3},
    {lat:-14,lon:130,r:8},{lat:-16,lon:128,r:9},{lat:-18,lon:124,r:9},
    {lat:-20,lon:120,r:9},{lat:-22,lon:118,r:10},{lat:-24,lon:120,r:11},
    {lat:-26,lon:122,r:11},{lat:-26,lon:128,r:12},{lat:-28,lon:132,r:12},
    {lat:-28,lon:138,r:11},{lat:-30,lon:138,r:11},{lat:-30,lon:144,r:10},
    {lat:-32,lon:146,r:10},{lat:-34,lon:142,r:9},{lat:-36,lon:144,r:8},
    {lat:-38,lon:146,r:7},{lat:-36,lon:148,r:6},{lat:-38,lon:144,r:6},
    {lat:-22,lon:142,r:10},{lat:-18,lon:138,r:9},{lat:-18,lon:146,r:7},
    {lat:-16,lon:145,r:7},{lat:-14,lon:143,r:6},
    {lat:-42,lon:146,r:4},{lat:-42,lon:148,r:4},
    {lat:-36,lon:175,r:4},{lat:-38,lon:176,r:4},{lat:-40,lon:176,r:4},
    {lat:-42,lon:172,r:4},{lat:-44,lon:170,r:4},{lat:-46,lon:168,r:4},
    {lat:-68,lon:-60,r:10},{lat:-70,lon:0,r:14},{lat:-70,lon:30,r:14},
    {lat:-70,lon:60,r:14},{lat:-70,lon:90,r:14},{lat:-70,lon:120,r:14},
    {lat:-70,lon:150,r:14},{lat:-70,lon:180,r:14},{lat:-70,lon:-30,r:14},
    {lat:-70,lon:-60,r:14},{lat:-70,lon:-90,r:14},{lat:-70,lon:-120,r:14},
    {lat:-70,lon:-150,r:14},{lat:-76,lon:0,r:16},{lat:-76,lon:45,r:16},
    {lat:-76,lon:90,r:16},{lat:-76,lon:135,r:16},{lat:-76,lon:180,r:16},
    {lat:-76,lon:-45,r:16},{lat:-76,lon:-90,r:16},{lat:-76,lon:-135,r:16},
    {lat:-82,lon:0,r:18},{lat:-82,lon:60,r:18},{lat:-82,lon:120,r:18},
    {lat:-82,lon:180,r:18},{lat:-82,lon:-60,r:18},{lat:-82,lon:-120,r:18},
  ];
}
