varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

uniform vec2 uDeviceOrientation;
uniform float uTime;

// PBR functions
const float PI = 3.14159265359;

float DistributionGGX(vec3 N, vec3 H, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NdotH2 = NdotH * NdotH;

  float nom = a2;
  float denom = (NdotH2 * (a2 - 1.0) + 1.0);
  denom = PI * denom * denom;

  return nom / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness) {
  float r = (roughness + 1.0);
  float k = (r * r) / 8.0;

  float nom = NdotV;
  float denom = NdotV * (1.0 - k) + k;

  return nom / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float ggx2 = GeometrySchlickGGX(NdotV, roughness);
  float ggx1 = GeometrySchlickGGX(NdotL, roughness);

  return ggx1 * ggx2;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // PBR parameters for paper-like material
  float metallic = 0.0;  // 纸张几乎没有金属感
  float roughness = 0.8;  // 增加粗糙度，模拟纸张的微表面
  vec3 albedo = vec3(0.98, 0.98, 0.98);  // 纯白色
  vec3 F0 = vec3(0.02);  // 降低基础反射率
  F0 = mix(F0, albedo, metallic);

  // Iridescent effect - 增强虹彩效果
  float fresnel = 1.0 - abs(dot(normal, viewDir));
  float iridescenceStrength = 0.35;  // 增加虹彩强度

  vec3 iridescence = vec3(sin(fresnel * 3.0 + uTime + uDeviceOrientation.x), sin(fresnel * 3.0 + uTime + 2.0 + uDeviceOrientation.y), sin(fresnel * 3.0 + uTime + 4.0)) * 0.4 + 0.6;  // 增加颜色变化幅度和频率

  // Environment lighting - 调整光照以模拟纸张
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  vec3 halfDir = normalize(viewDir + lightDir);
  float NdotL = max(dot(normal, lightDir), 0.0);
  float NdotH = max(dot(normal, halfDir), 0.0);
  float NdotV = max(dot(normal, viewDir), 0.0);
  float HdotV = max(dot(halfDir, viewDir), 0.0);

  // PBR calculations
  float NDF = DistributionGGX(normal, halfDir, roughness);
  float G = GeometrySmith(normal, viewDir, lightDir, roughness);
  vec3 F = fresnelSchlick(HdotV, F0);

  vec3 numerator = NDF * G * F;
  float denominator = max(4.0 * NdotV * NdotL, 0.001);
  vec3 specular = numerator / denominator;

  vec3 kS = F;
  vec3 kD = (vec3(1.0) - kS) * (1.0 - metallic);

  vec3 Lo = (kD * albedo / PI + specular) * NdotL;
  vec3 ambient = vec3(0.15) * albedo;  // 增加环境光，让纸张看起来更自然
  vec3 color = ambient + Lo;

  // Mix iridescence with PBR - 更微妙的混合
  float mixFactor = fresnel * iridescenceStrength;
  color = mix(color, iridescence, mixFactor);

  gl_FragColor = vec4(color, 1.0);
}
