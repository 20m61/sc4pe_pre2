'use client';

import Head from 'next/head';
import useAudioAnalyser from '../hooks/useAudioAnalyser';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import RandomMesh from '../components/RandomMesh';

export default function Home() {
  const audioData = useAudioAnalyser();
  const { transcript, isListening, words } = useSpeechRecognition();

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
        style={{
          height: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <RandomMesh audioData={Array.from(audioData)} />
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'white',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              style={{ display: 'inline-block', marginRight: '5px' }}
            >
              {word}
            </span>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'white',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '50px',
          }}
        >
          {transcript}
        </div>
      </main>
    </div>
  );
}
