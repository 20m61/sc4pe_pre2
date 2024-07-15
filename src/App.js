import React from 'react';
import './styles/main.scss';
import { ThreeProvider } from './ThreeContext';
import AudioVisualizer from './AudioVisualizer';

function App() {
  return (
    <ThreeProvider>
      <AudioVisualizer />
    </ThreeProvider>
  );
}

export default App;
