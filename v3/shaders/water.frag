// Water fragment shader — iGraSpore V3
precision highp float;
varying vec2 vTexCoord;
varying float vWaveHeight;
uniform float uTime;
uniform vec3 uLightDir;
uniform float uDayLight;   // 0..1
uniform float uDepth;      // 0=surface, 1=bottom
uniform vec2 uResolution;
uniform vec2 uSunPos;      // sun screen position

// Perlin-like noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float pnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash(i);
  float b = hash(i+vec2(1.0,0.0));
  float c = hash(i+vec2(0.0,1.0));
  float d = hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for(int i = 0; i < 4; i++) {
    v += a * pnoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vTexCoord;
  float t = uTime * 0.15;
  
  // === WATER COLOR: photic zone → benthos ===
  // Top (surface): bright green-blue
  // Bottom (deep): dark teal
  float depthFactor = clamp(uDepth, 0.0, 1.0);
  vec3 surfaceColor = vec3(0.05, 0.35, 0.30);  // teal-green
  vec3 deepColor = vec3(0.01, 0.05, 0.08);      // near black
  vec3 waterColor = mix(surfaceColor, deepColor, depthFactor);
  
  // Day light modulation
  waterColor *= (0.3 + uDayLight * 0.7);
  
  // === RIPPLES ===
  float ripple1 = fbm(uv * 8.0 + vec2(t, t * 0.7));
  float ripple2 = fbm(uv * 16.0 + vec2(-t * 0.5, t));
  float ripples = ripple1 * 0.6 + ripple2 * 0.4;
  
  // Caustic patterns — light focused by surface waves
  float caustic = pow(ripples, 3.0) * 2.0;
  caustic = clamp(caustic, 0.0, 1.0);
  vec3 causticColor = vec3(0.6, 0.9, 0.8) * caustic * uDayLight * 0.5;
  
  // === SUN GLITTER on surface ===
  float distToSun = length(uv * uResolution - uSunPos) / uResolution.x;
  float sunGlitter = exp(-distToSun * distToSun * 20.0) * uDayLight;
  // Sparkle
  float sparkle = pow(ripples, 8.0) * sunGlitter * 3.0;
  vec3 glitterC = vec3(1.0, 0.95, 0.7) * sparkle;
  
  // === DEPTH FOG ===
  float fog = exp(-depthFactor * 2.0);
  
  // === FINAL COMPOSITE ===
  vec3 color = waterColor;
  color += causticColor * fog;
  color += glitter * fog * 0.5;
  color += vec3(vWaveHeight * 0.02); // subtle wave shading
  
  gl_FragColor = vec4(color, 1.0);
}
