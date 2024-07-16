'use client';

import Head from 'next/head';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // シーン、カメラ、レンダラーの作成
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // リサイズ対応
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    // アニメーションの設定
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Audio Visualizer</title>
        <meta
          name="description"
          content="Audio visualizer using Three.js and Web Audio API"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        ref={mountRef}
        style={{
          height: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      />
    </div>
  );
}
