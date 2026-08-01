// Organism fragment shader — iGraSpore V3
precision highp float;
varying vec3 vColor;
uniform float uAlpha;

void main() {
  // Distance from center for soft circle
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c) * 2.0;
  if(d > 1.0) discard;
  float alpha = smoothstep(1.0, 0.8, d) * uAlpha;
  
  // Inner glow
  vec3 color = vColor;
  color += vec3(0.2) * (1.0 - d);
  
  gl_FragColor = vec4(color, alpha);
}
