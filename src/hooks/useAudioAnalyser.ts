import { useState, useEffect, useRef } from 'react';

const useAudioAnalyser = () => {
  const [audioData, setAudioData] = useState(new Uint8Array(128));
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(
            'getUserMedia is not supported in this browser or context.'
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioContext = new window.AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        source.connect(analyser);
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyserRef.current = analyser;

        const updateAudioData = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            setAudioData(new Uint8Array(dataArray));
            console.log(dataArray); // Log the audio data
            requestAnimationFrame(updateAudioData);
          }
        };

        updateAudioData();
      } catch (err) {
        console.error('Error accessing the microphone:', err);
      }
    };

    initAudio();
  }, []);

  return audioData;
};

export default useAudioAnalyser;
