// Instanced organism vertex shader — iGraSpore V3
attribute vec2 aPosition;
attribute vec2 aOffset;    // per-instance position
attribute float aSize;     // per-instance size
attribute vec3 aColor;     // per-instance color
attribute float aRotation; // per-instance rotation

uniform mat4 uProjection;
uniform float uZoom;

varying vec3 vColor;

void main() {
  float c = cos(aRotation);
  float s = sin(aRotation);
  vec2 rotated = vec2(
    aPosition.x * c - aPosition.y * s,
    aPosition.x * s + aPosition.y * c
  ) * aSize;
  
  vec2 worldPos = rotated + aOffset;
  gl_Position = uProjection * vec4(worldPos, 0.0, 1.0);
  vColor = aColor;
}
