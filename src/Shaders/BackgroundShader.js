// React Three Fiber
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "glslify";

const BackgroundShader = shaderMaterial(
  // Uniforms
  {
    uTime: 0
  },
  // Vertex Shader
  glsl`
    precision mediump float ;
    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float uTime;
    uniform vec2 uPixels;

    float PI = 3.14159265359;
   
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * viewMatrix  * modelViewMatrix * vec4(position, 1.0);  
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float uTime;  
    uniform float uProgress;
    uniform sampler2D texture1;
    uniform vec4 resolution;

    float PI = 3.14159265359;


    // NOISE
    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

    float noise(vec3 p){
      vec3 a = floor(p);
      vec3 d = p - a;
      d = d * d * (3.0 - 2.0 * d);

      vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
      vec4 k1 = perm(b.xyxy);
      vec4 k2 = perm(k1.xyxy + b.zzww);

      vec4 c = k2 + a.zzzz;
      vec4 k3 = perm(c);
      vec4 k4 = perm(c + 1.0);

      vec4 o1 = fract(k3 * (1.0 / 41.0));
      vec4 o2 = fract(k4 * (1.0 / 41.0));

      vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
      vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

      return o4.y * d.y + o4.x * (1.0 - d.y);
    }

    float lines(vec2 uv, float offset){
      return smoothstep(
        0., 0.5 + offset * 0.5,
        abs(0.5 * sin(uv.x*30.) + offset * 2.)
      );
    }

    mat2 rotate2D(float angle){
      return mat2(s
        cos(angle), -sin(angle), sin(angle), cos(angle)
      );
    }

    void main() {
      float n = noise(vPosition + uTime/5.);
      vec3 color1 =  vec3(0,0,1.26);
      vec3 color2 =  vec3(0.0, 0.0, 0.0);
      vec3 color3 =  vec3(1.2,0.2,1.2);
      // vec3 color4 = vec3(0.91, 0.79, 0.29);

      vec2 baseUV = rotate2D(n) * vPosition.xy * 0.1;
      float basePattern = lines(baseUV, 0.1);
      float secondPattern = lines(baseUV, 0.05);

      vec3 baseColor = mix(color3, color1, basePattern);
      vec3 secondBaseColor = mix(baseColor, color2, secondPattern);
      gl_FragColor = vec4(vec3(secondBaseColor),1.2); 
    }
  `
);
extend({
  BackgroundShader
});

export default BackgroundShader;
