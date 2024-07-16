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

    // ランダムメッシュの作成
    const createRandomMesh = () => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];

      for (let i = 0; i < 1000; i++) {
        vertices.push(
          THREE.MathUtils.randFloatSpread(20), // x座標
          THREE.MathUtils.randFloatSpread(20), // y座標
          THREE.MathUtils.randFloatSpread(20) // z座標
        );
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      const material = new THREE.PointsMaterial({ color: 0xffffff });
      const points = new THREE.Points(geometry, material);

      return points;
    };

    const randomMesh = createRandomMesh();
    scene.add(randomMesh);

    camera.position.z = 30;

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
      randomMesh.rotation.x += 0.01;
      randomMesh.rotation.y += 0.01;
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
