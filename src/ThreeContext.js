import React, { createContext, useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeContext = createContext();

const ThreeProvider = ({ children }) => {
    const canvasRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const rendererRef = useRef(new THREE.WebGLRenderer());

    useEffect(() => {
        const canvas = canvasRef.current;
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        const renderer = rendererRef.current;

        renderer.setSize(window.innerWidth, window.innerHeight);
        canvas.appendChild(renderer.domElement);
        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            canvas.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <ThreeContext.Provider value={{ scene: sceneRef.current, camera: cameraRef.current }}>
            <div ref={canvasRef} style={{ width: '100vw', height: '100vh' }}>
                {children}
            </div>
        </ThreeContext.Provider>
    );
};

export { ThreeContext, ThreeProvider };
