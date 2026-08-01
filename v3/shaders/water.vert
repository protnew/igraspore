// Water vertex shader — iGraSpore V3
attribute vec2 aPosition;
attribute vec2 aTexCoord;
uniform mat4 uProjection;
uniform float uTime;
uniform float uZoom;
varying vec2 vTexCoord;
varying float vWaveHeight;

// Simple noise
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vTexCoord = aTexCoord;
  // Wave displacement
  vec2 worldPos = aPosition;
  float wave = smoothNoise(worldPos * 0.02 + uTime * 0.3) * 2.0;
  wave += smoothNoise(worldPos * 0.05 + uTime * 0.5) * 1.0;
  vWaveHeight = wave;
  gl_Position = uProjection * vec4(worldPos.x, worldPos.y, 0.0, 1.0);
}
