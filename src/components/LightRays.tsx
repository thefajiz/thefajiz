import { useRef, useEffect } from "react"
import * as THREE from "three"

const VERTEX_SHADER = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const FRAGMENT_SHADER = `
uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float mod289(float x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
float permute(float x){return mod289(((x*34.)+1.)*x);}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
float taylorInvSqrt(float r){return 1.79284291400159-0.85373472095314*r;}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
vec2 fade(vec2 t){return t*t*t*(t*(t*6.-15.)+10.);}

float pnoise(vec2 P,vec2 rep){
  vec4 Pi=floor(P.xyxy)+vec4(0.,0.,1.,1.);
  vec4 Pf=fract(P.xyxy)-vec4(0.,0.,1.,1.);
  Pi=mod(Pi,rep.xyxy);Pi=mod289(Pi);
  vec4 ix=Pi.xzxz,iy=Pi.yyww,fx=Pf.xzxz,fy=Pf.yyww;
  vec4 i=permute(permute(ix)+iy);
  vec4 gx=fract(i*(1./41.))*2.-1.;
  vec4 gy=abs(gx)-.5;
  vec4 tx=floor(gx+.5);gx=gx-tx;
  vec2 g00=vec2(gx.x,gy.x),g10=vec2(gx.y,gy.y);
  vec2 g01=vec2(gx.z,gy.z),g11=vec2(gx.w,gy.w);
  vec4 norm=taylorInvSqrt(vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11)));
  g00*=norm.x;g01*=norm.y;g10*=norm.z;g11*=norm.w;
  float n00=dot(g00,vec2(fx.x,fy.x));
  float n10=dot(g10,vec2(fx.y,fy.y));
  float n01=dot(g01,vec2(fx.z,fy.z));
  float n11=dot(g11,vec2(fx.w,fy.w));
  vec2 fade_xy=fade(Pf.xy);
  vec2 n_x=mix(vec2(n00,n01),vec2(n10,n11),fade_xy.x);
  return 2.3*mix(n_x.x,n_x.y,fade_xy.y);
}

float rayStrength(vec2 raySource,vec2 rayRefDirection,vec2 coord,float seedA,float seedB,float speed){
  vec2 sourceToCoord=coord-raySource;
  float cosAngle=dot(normalize(sourceToCoord),rayRefDirection);
  float diagonal=length(u_resolution);
  return clamp(
    (.45+0.15*sin(cosAngle*seedA+u_time*speed))+
    (0.3+0.2*cos(-cosAngle*seedB+u_time*speed)),
    u_reach,1.0)*
    clamp((diagonal-length(sourceToCoord))/diagonal,u_reach,1.0);
}

void main(){
  vec2 coord=vec2(gl_FragCoord.x,u_resolution.y-gl_FragCoord.y);
  float speed=u_rays*10.;
  vec2 rayPos1=u_rayPos1;
  vec2 rayRefDir1=normalize(vec2(1.,-0.116));
  float raySeedA1=36.2214*speed,raySeedB1=21.11349*speed,raySpeed1=1.5*speed;
  vec2 rayPos2=u_rayPos2;
  vec2 rayRefDir2=normalize(vec2(1.,0.241));
  float raySeedA2=22.39910*speed,raySeedB2=18.0234*speed,raySpeed2=1.1*speed;
  float strength1=rayStrength(rayPos1,rayRefDir1,coord,raySeedA1,raySeedB1,raySpeed1);
  float strength2=rayStrength(rayPos2,rayRefDir2,coord,raySeedA2,raySeedB2,raySpeed2);
  float brightness=1.*u_reach-(coord.y/u_resolution.y);
  float attenuation=clamp(brightness+(0.5+u_intensity),0.,1.);
  float alpha1=strength1*attenuation*u_colors[0].a;
  float alpha2=strength2*attenuation*u_colors[1].a;
  vec3 premultColor1=u_colors[0].rgb*alpha1;
  vec3 premultColor2=u_colors[1].rgb*alpha2;
  vec3 blendedColor=premultColor1+premultColor2;
  float blendedAlpha=alpha1+alpha2*(1.-alpha1);
  vec3 finalRGB=blendedColor/max(blendedAlpha,0.0001);
  gl_FragColor=vec4(finalRGB*blendedAlpha,blendedAlpha);
}
`

interface LightRaysProps {
  intensity?: number   // 0–100, default 50
  rays?: number        // 0–100, default 30
  reach?: number       // 0–100, default 40
  position?: number    // 0–100, default 60
  speed?: number       // default 10
  color1?: string      // default gold #c9a84c
  color2?: string      // default dark gold #8B6914
  className?: string
}

function hexToRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

function mapRange(v: number, a: number, b: number, c: number, d: number) {
  return c + ((v - a) / (b - a)) * (d - c)
}

export default function LightRays({
  intensity = 50,
  rays = 30,
  reach = 40,
  position = 60,
  speed = 10,
  color1 = "#c9a84c",
  color2 = "#8B6914",
  className = "",
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75, container.clientWidth / container.clientHeight, 0.1, 1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: true, premultipliedAlpha: true,
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(1)
    container.appendChild(renderer.domElement)

    const [r1, g1, b1] = hexToRGB(color1)
    const [r2, g2, b2] = hexToRGB(color2)
    const W = container.clientWidth
    const H = container.clientHeight

    const material = new THREE.ShaderMaterial({
      fragmentShader: FRAGMENT_SHADER,
      vertexShader: VERTEX_SHADER,
      transparent: true,
      uniforms: {
        u_resolution: { value: [W, H] },
        u_time: { value: Math.random() * 10000 },
        u_colors: { value: [
          new THREE.Vector4(r1, g1, b1, 1),
          new THREE.Vector4(r2, g2, b2, 1),
        ]},
        u_intensity: { value: mapRange(intensity, 0, 100, 0, 0.5) },
        u_rays:      { value: mapRange(rays, 0, 100, 0, 0.3) },
        u_reach:     { value: mapRange(reach, 0, 100, 0, 0.5) },
        u_rayPos1: { value: [position / 100 * W, -0.4 * H] },
        u_rayPos2: { value: [(position / 100 + 0.02) * W, -0.5 * H] },
      },
    })

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1024, 1024), material)
    scene.add(mesh)

    let frameId: number
    const animate = (time: number) => {
      material.uniforms.u_time.value += (speed / 1000) / 10
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      material.dispose()
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  )
}
