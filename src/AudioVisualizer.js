import React, { useContext, useEffect } from 'react';
import * as THREE from 'three';
import { ThreeContext } from './ThreeContext';
import useAudioAnalyser from './useAudioAnalyser';

const AudioVisualizer = () => {
    const { scene } = useContext(ThreeContext);
    const audioData = useAudioAnalyser();

    useEffect(() => {
        const geometry = new THREE.PlaneGeometry(5, 5, 16, 16);
        const material = new THREE.ShaderMaterial({
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float time;
        uniform float audioData[128];
        varying vec2 vUv;
        void main() {
          float colorFactor = audioData[int(vUv.x * 127.0)] / 255.0;
          vec3 color = vec3(colorFactor, 0.5 * colorFactor, 1.0 - colorFactor);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
            uniforms: {
                time: { value: 0.0 },
                audioData: { value: new Array(128).fill(0) },
            },
            wireframe: false,
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        const animate = () => {
            material.uniforms.audioData.value = audioData;

            const position = geometry.attributes.position;
            const count = position.count;

            for (let i = 0; i < count; i++) {
                const x = position.getX(i);
                const y = position.getY(i);
                const audioIndex = Math.floor((x + 2.5) / 5 * 127);
                const audioValue = audioData[audioIndex] / 255;
                const z = audioValue * 2.0; // FFTの値に基づいてZ軸を動かす
                position.setZ(i, z);
            }

            position.needsUpdate = true;
            material.uniforms.time.value = performance.now() * 0.001;

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            scene.remove(plane);
        };
    }, [scene, audioData]);

    return null;
};

export default AudioVisualizer;
