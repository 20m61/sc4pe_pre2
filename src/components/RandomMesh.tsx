// src/components/RandomMesh.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RandomMeshProps {
  audioData: number[];
}

const RandomMesh: React.FC<RandomMeshProps> = ({ audioData }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  let renderer: THREE.WebGLRenderer;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // シーン、カメラの作成
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // レンダラーの作成または再利用
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
    } else {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.clear();
    }
    mount.appendChild(renderer.domElement);

    // ランダムメッシュの作成
    const createRandomMesh = () => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const colors = [];

      for (let i = 0; i < 500; i++) {
        vertices.push(
          THREE.MathUtils.randFloatSpread(20), // x座標
          THREE.MathUtils.randFloatSpread(20), // y座標
          THREE.MathUtils.randFloatSpread(20) // z座標
        );

        // 初期色は白
        colors.push(1, 1, 1);
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      );

      const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.5,
      });
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

      // FFTデータに基づいて頂点位置と色を更新
      const positions = Array.from(
        randomMesh.geometry.attributes.position.array
      ) as number[];
      const colors = Array.from(
        randomMesh.geometry.attributes.color.array
      ) as number[];
      let needsUpdate = false;

      for (let i = 0; i < positions.length; i += 3) {
        const audioIndex = Math.floor((i / 3) % audioData.length);
        const audioValue = audioData[audioIndex] / 255.0;

        // z座標を更新
        if (positions[i + 2] !== audioValue * 10.0) {
          positions[i + 2] = audioValue * 20.0; // Increase the factor for more noticeable changes
          needsUpdate = true;
        }

        // 色を更新
        colors[i] = audioValue; // R
        colors[i + 1] = 1 - audioValue; // G
        colors[i + 2] = audioValue; // B
      }

      if (needsUpdate) {
        randomMesh.geometry.attributes.position.needsUpdate = true;
        randomMesh.geometry.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // コンポーネントのアンマウント時にWebGLコンテキストを破棄する
    return () => {
      // ジオメトリとマテリアルの破棄
      randomMesh.geometry.dispose();
      randomMesh.material.dispose();

      // シーンからメッシュを削除
      scene.remove(randomMesh);

      // レンダラーの破棄
      renderer.dispose();

      mount.removeChild(renderer.domElement);
      window.removeEventListener('resize', onWindowResize);
    };
  }, [audioData]);

  return (
    <div
      ref={mountRef}
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    />
  );
};

export default RandomMesh;
