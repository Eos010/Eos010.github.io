import{r as e,t}from"./react.yIOJJ3r4.js";import{t as n}from"./jsx-runtime.DvU585tb.js";import{i as r,n as i,r as a,t as o}from"./Triangle.qFQnJErr.js";var s=e(t(),1),c=n(),l=e=>{let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16)/255,parseInt(t[2],16)/255,parseInt(t[3],16)/255]:[1,1,1]},u=e=>e===`low`?40:e===`high`?110:70,d=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,f=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`,p=new WeakMap,m=({horizonColor:e=`#5227FF`,waveColor:t=`#FF9FFC`,crestColor:n=`#FFFFFF`,speed:m=.4,amplitude:h=2.5,waveScale:g=.6,waveRatio:_=.9,swell:v=35,turbulence:y=20,tilt:b=1.11,zoom:x=1,height:S=5.5,fogDepth:C=15,detail:w=`medium`,brightness:T=1,opacity:E=1,mouseInteraction:D=!0,parallaxStrength:O=.5,grain:k=!0,grainIntensity:A=.05,passiveParallax:j=!1,className:M=``})=>{let N=(0,s.useRef)(null),P=(0,s.useRef)(D);return(0,s.useEffect)(()=>{let e=N.current;if(!e)return;let t;try{t=new a({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)})}catch(e){console.warn(`[GradientWaves] WebGL2 不可用，保留站里原有的 CSS 壁纸：`,e);return}let n=t.gl;n.clearColor(0,0,0,0);let s=n.canvas;s.style.width=`100%`,s.style.height=`100%`,s.style.display=`block`,e.appendChild(s);let c=new o(n),l=new r(n,{vertex:d,fragment:f,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.4},uAmplitude:{value:2.5},uWaveScale:{value:.6},uWaveRatio:{value:.9},uSwell:{value:35},uTurbulence:{value:20},uTilt:{value:1.11},uZoom:{value:1},uHeight:{value:5.5},uFogDepth:{value:15},uSteps:{value:70},uBrightness:{value:1},uOpacity:{value:1},uGrain:{value:1},uGrainIntensity:{value:.05},uMouse:{value:new Float32Array([.5,.5])},uParallax:{value:.5},uEnableMouse:{value:!0},uHorizonColor:{value:new Float32Array([1,1,1])},uWaveColor:{value:new Float32Array([1,1,1])},uCrestColor:{value:new Float32Array([1,1,1])}}}),u=new i(n,{geometry:c,program:l});p.set(e,{renderer:t,program:l,mesh:u});let m=()=>{let r=e.getBoundingClientRect(),i=Math.max(1,Math.floor(r.width)),a=Math.max(1,Math.floor(r.height));t.setSize(i,a);let o=l.uniforms.iResolution.value;o[0]=n.drawingBufferWidth,o[1]=n.drawingBufferHeight,t.render({scene:u})},h=new ResizeObserver(m);h.observe(e),m();let g=[.5,.5],_=[.5,.5],v=j?window:s,y=e=>{let t=j?{left:0,top:0,width:window.innerWidth,height:window.innerHeight}:s.getBoundingClientRect();_[0]=(e.clientX-t.left)/t.width,_[1]=1-(e.clientY-t.top)/t.height},b=()=>{_[0]=.5,_[1]=.5};v.addEventListener(`pointermove`,y),j||s.addEventListener(`pointerleave`,b);let x=0,S=!0,C=!document.hidden,w=performance.now(),T=e=>{l.uniforms.iTime.value=(e-w)*.001;let n=P.current?_[0]:.5,r=P.current?_[1]:.5;g[0]+=.05*(n-g[0]),g[1]+=.05*(r-g[1]),l.uniforms.uMouse.value[0]=g[0],l.uniforms.uMouse.value[1]=g[1],t.render({scene:u}),x=requestAnimationFrame(T)},E=()=>{S&&C&&x===0&&(x=requestAnimationFrame(T))},D=()=>{x!==0&&(cancelAnimationFrame(x),x=0)},O=new IntersectionObserver(([e])=>{S=e.isIntersecting,S?E():D()},{threshold:0});O.observe(e);let k=()=>{C=!document.hidden,C?E():D()};return document.addEventListener(`visibilitychange`,k),E(),()=>{D(),h.disconnect(),O.disconnect(),document.removeEventListener(`visibilitychange`,k),v.removeEventListener(`pointermove`,y),j||s.removeEventListener(`pointerleave`,b),p.delete(e);try{e.removeChild(s)}catch{}n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,s.useEffect)(()=>{let r=N.current;if(!r)return;let i=p.get(r);if(!i)return;let{program:a}=i,o=a.uniforms;P.current=D,o.uSpeed.value=m,o.uAmplitude.value=h,o.uWaveScale.value=g,o.uWaveRatio.value=_,o.uSwell.value=v,o.uTurbulence.value=y,o.uTilt.value=b,o.uZoom.value=x,o.uHeight.value=S,o.uFogDepth.value=C,o.uSteps.value=u(w),o.uBrightness.value=T,o.uOpacity.value=E,o.uGrain.value=+!!k,o.uGrainIntensity.value=A,o.uParallax.value=O,o.uEnableMouse.value=D;let s=o.uHorizonColor.value,c=o.uWaveColor.value,d=o.uCrestColor.value,f=l(e),j=l(t),M=l(n);s[0]=f[0],s[1]=f[1],s[2]=f[2],c[0]=j[0],c[1]=j[1],c[2]=j[2],d[0]=M[0],d[1]=M[1],d[2]=M[2]},[e,t,n,m,h,g,_,v,y,b,x,S,C,w,T,E,k,A,D,O]),(0,c.jsx)(`div`,{ref:N,className:`gradient-waves-container ${M}`.trim()})},h={light:{horizonColor:`#6366f1`,waveColor:`#06b6d4`,crestColor:`#b8c4ff`,opacity:.82,brightness:.92},dark:{horizonColor:`#96a4ff`,waveColor:`#35d6c2`,crestColor:`#ffffff`,opacity:.55,brightness:1}};function g(){let[e,t]=(0,s.useState)(!1),[n,r]=(0,s.useState)(`light`);return(0,s.useEffect)(()=>{if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let e=document.documentElement,n=()=>r(e.dataset.theme===`dark`?`dark`:`light`);n(),t(!0);let i=new MutationObserver(n);return i.observe(e,{attributes:!0,attributeFilter:[`data-theme`]}),()=>i.disconnect()},[]),e?(0,c.jsx)(m,{className:`site-waves`,...h[n],detail:`low`,grainIntensity:.03,parallaxStrength:.35,passiveParallax:!0}):null}export{g as default};