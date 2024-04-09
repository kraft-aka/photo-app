'use client';

import * as React from 'react';

export default function Page() {
  let videoElem: any = React.useRef<HTMLDivElement>(null);
  const canvas: any = React.useRef<HTMLCanvasElement>(null);
  const canvasOutcome: any = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    async function activateCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoElem.current.srcObject = stream;
      } catch (err) {
        console.log(err);
      }
    }
    activateCamera();
  }, []);

  // creates canvas from video
  function activateCanvas() {
    try {
      if (videoElem.current && canvas.current) {
        canvas.current.width = videoElem.current.videoWidth;
        canvas.current.height = videoElem.current.videoHeight;
        const context = canvas.current.getContext('2d');
        if (context) {
          context.drawImage(
            videoElem.current,
            0,
            0,
            canvas.current.width,
            canvas.current.height,
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
    console.log('Canvas is activeted');
  }

  function draw() {
    try{
      if (canvasOutcome.current.width !== canvas.current.width && canvasOutcome.current.heigth !== canvas.current.height) {
        canvasOutcome.current.width = canvas.current.width;
        canvasOutcome.current.height = canvas.current.height;
      }
      const contextFromSnapshot = canvas.current.getContext('2d',{willReadFrequently: true});
      const context = canvasOutcome.current.getContext('2d');
      
      const pickColor = (x,y) => {
        let imgData = contextFromSnapshot.getImageData(x,y, 1, 1);
        const [r,g,b,a] = imgData.data;
        return `rgb(${r} ${g} ${b})`
      };

      for(let i = 0; i < 10000; ++i) {
        const x = Math.random() * canvas.current.width;
        const y = Math.random() * canvas.current.height;
        const color = pickColor(x, y);

        context.fillStyle = color;
        context.fillRect(x, y, 10, 10);
      }
      
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <video playsInline autoPlay ref={videoElem}></video>
      <canvas ref={canvas}></canvas>
      <canvas id='canvas-outcome' ref={canvasOutcome}></canvas>
      <button onClick={activateCanvas}>Take snapshot</button>
      <button onClick={draw}>Draw</button>
    </main>
  );
}
