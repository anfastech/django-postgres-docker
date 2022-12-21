// React Three Fiber
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "glslify";

const SphereShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uCube: 0
  },
  // Vertex Shader
  glsl`
    precision mediump float;
    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float uTime;
    uniform vec2 uPixels;

    #define PI 3.14159265359;

		varying vec3 vReflect;
		varying vec3 vRefract[3];
		varying float vReflectionFactor;

		void main() {

// Adding from test-base 

// float mRefractionRatio = 0.65;
// float mFresnelBias = 0.0;
// float mFresnelScale = 0.4;
// float mFresnelPower = 1.74;
// vUv = uv;



      float mRefractionRatio = 0.55;
      float mFresnelBias = 0.0;
      float mFresnelScale = 0.4;
      float mFresnelPower = 1.84;
      vUv = uv;

			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
			vec3 I = worldPosition.xyz - cameraPosition;

			vReflect = reflect( I, worldNormal );
			vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
			vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
			vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );
			vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform float uTime;  
    uniform float uProgress;
    uniform sampler2D texture1;
    uniform vec4 resolution;
    uniform samplerCube uCube;

    varying vec2 vUv; 
    varying vec3 vPosition;

    varying vec3 vReflect;
		varying vec3 vRefract[3];
		varying float vReflectionFactor;

		void main() {

      vec4 reflectedColor = textureCube( uCube, vec3( -vReflect.x, vReflect.yz ) );
			vec4 refractedColor = vec4( 1.0 );

			refractedColor.r = textureCube( uCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
			refractedColor.g = textureCube( uCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
			refractedColor.b = textureCube( uCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

			gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );
		}
  `
);
extend({
  SphereShaderMaterial
});

export default SphereShaderMaterial;
