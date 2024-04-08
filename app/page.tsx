'use client';

import * as React from 'react';

export default function Page() {
  let videoElem: any = React.useRef<HTMLDivElement>(null);
  const canvas: any = React.useRef<HTMLCanvasElement>(null);

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

  return (
    <main className="flex min-h-screen flex-col p-6">
      <video playsInline autoPlay ref={videoElem}></video>
      <canvas ref={canvas}></canvas>
      <button onClick={activateCanvas}>Draw Image</button>
    </main>
  );
}
