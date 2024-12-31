import { useState, useEffect } from 'react';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import * as THREE from 'three';

const useFontLoader = (fontUrls: string[]) => {
  const [fonts, setFonts] = useState<THREE.Font[]>([]);

  useEffect(() => {
    const fontLoader = new FontLoader();

    const loadFont = (url: string): Promise<THREE.Font> => {
      return new Promise((resolve, reject) => {
        fontLoader.load(url, resolve, undefined, reject);
      });
    };

    Promise.all(fontUrls.map(loadFont)).then((loadedFonts) => {
      setFonts(loadedFonts);
    });
  }, [fontUrls]);

  return fonts;
};

export default useFontLoader;
