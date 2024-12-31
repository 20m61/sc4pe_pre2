// src/components/TextMesh.tsx
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

interface TextMeshProps {
  text: string;
  font: THREE.Font;
  position: THREE.Vector3;
  scene: THREE.Scene;
}

const TextMesh: React.FC<TextMeshProps> = ({ text, font, position, scene }) => {
  useEffect(() => {
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 1,
      depth: 0.1,
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.copy(position);

    scene.add(textMesh);

    return () => {
      textGeometry.dispose();
      textMaterial.dispose();
      scene.remove(textMesh);
    };
  }, [text, font, position, scene]);

  return null;
};

export default TextMesh;
