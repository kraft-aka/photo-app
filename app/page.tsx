'use client';

import * as React from 'react';

export default function Page() {
  let videoElem: any = React.useRef<HTMLDivElement>(null);
  const canvas: any = React.useRef<HTMLCanvasElement>(null);
  const canvasOutcome: any = React.useRef<HTMLCanvasElement>(null);

  const [drawFunction, setDrawFunction] = React.useState(null);

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

  React.useEffect(() => {
    if(!drawFunction) {
      return;
    }
    let keepRunning = true;
    const callDrawFunction = () => {
      drawFunction();
      if(keepRunning) {
        window.requestAnimationFrame(callDrawFunction);
      }
    }
    callDrawFunction();
    return () => {
      keepRunning = false;
    };
  }, [drawFunction]);

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
    try {
      if (
        canvasOutcome.current.width !== canvas.current.width &&
        canvasOutcome.current.heigth !== canvas.current.height
      ) {
        canvasOutcome.current.width = canvas.current.width;
        canvasOutcome.current.height = canvas.current.height;
      }
      const contextFromSnapshot = canvas.current.getContext('2d', {
        willReadFrequently: true,
      });
      const context = canvasOutcome.current.getContext('2d');

      const pickColor = (x: number, y: number) => {
        let imgData = contextFromSnapshot.getImageData(x, y, 1, 1);
        const [r, g, b, a] = imgData.data;
        return `rgb(${r} ${g} ${b})`;
      };

      for (let i = 0; i < 10000; ++i) {
        const x = Math.random() * canvas.current.width;
        const y = Math.random() * canvas.current.height;
        const color = pickColor(x, y);

        context.fillStyle = color;
        context.fillRect(x, y, 10, 10);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function drawWithCircles() {
    try {
      if (
        canvasOutcome.current.width !== canvas.current.width &&
        canvasOutcome.current.heigth !== canvas.current.height
      ) {
        canvasOutcome.current.width = canvas.current.width;
        canvasOutcome.current.height = canvas.current.height;
      }
      const contextFromSnapshot = canvas.current.getContext('2d', {
        willReadFrequently: true,
      });
      const context = canvasOutcome.current.getContext('2d');

      const pickColor = (x: number, y: number) => {
        let imgData = contextFromSnapshot.getImageData(x, y, 1, 1);
        const [r, g, b, a] = imgData.data;
        return `rgb(${r} ${g} ${b})`;
      };

      for (let i = 0; i < 10000; ++i) {
        const x = Math.random() * canvas.current.width;
        const y = Math.random() * canvas.current.height;
        context.beginPath();
        const color = pickColor(x, y);

        const w = Math.random() * 100;
        const h = Math.random() * 5;
        context.lineWidth = Math.random();

        context.fillStyle = color;
        context.roundRect(x, y, w, h, [1, 1, 1, 1]);
        context.stroke()
        context.fill();
      }
    } catch (err) {
      console.log(err);
    }
  }

  function pickColor(ctx: CanvasRenderingContext2D, x: number, y: number): [number, number, number] {
    let imgData = ctx.getImageData(x, y, 1, 1);
    const data = imgData.data;
    return [data[0], data[1], data[2]];
  }

  function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
    const dr = c1[0] - c2[0];
    const dg = c1[1] - c2[1];
    const db = c1[2] - c2[2];
    return Math.sqrt(dr*dr + dg*dg + db*db);
  }

  function prepareCanvases() {
      if (
        canvasOutcome.current.width !== canvas.current.width &&
        canvasOutcome.current.heigth !== canvas.current.height
      ) {
        canvasOutcome.current.width = canvas.current.width;
        canvasOutcome.current.height = canvas.current.height;
      }
      const contextFromSnapshot = canvas.current.getContext('2d', {
        willReadFrequently: true,
      });
      const context = canvasOutcome.current.getContext('2d');
      return [contextFromSnapshot, context];
  }

  function drawWithLines() {
      const [contextFromSnapshot, context] = prepareCanvases();

      for (let i = 0; i < 100; ++i) {
        const x = Math.random() * canvas.current.width;
        const y = Math.random() * canvas.current.height;
        context.beginPath();
        const color = pickColor(contextFromSnapshot, x, y);

        let dx = x;
        let dy = y;
        let best = 1000;
        for(let j = 0; j < 10; ++j) {
          const tx = x + Math.random() * 40 - 20;
          const ty = y + Math.random() * 40 - 20;
          const color2 = pickColor(contextFromSnapshot, tx, ty);
          const distance = colorDistance(color, color2);
          if(distance < best) {
            dx = tx;
            dy = ty;
            best = distance;
          }
        }

        context.lineWidth = 5 + Math.random() * 4;

        context.strokeStyle = `rgb(${color[0]} ${color[1]} ${color[2]})`;
        context.moveTo(x, y);
        context.lineTo(dx, dy);
        context.stroke()
      }
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <video playsInline autoPlay ref={videoElem}></video>
      <canvas ref={canvas}></canvas>
      <canvas id="canvas-outcome" ref={canvasOutcome}></canvas>
      <button onClick={activateCanvas}>Take snapshot</button>
      <button onClick={draw}>Draw</button>
      <button onClick={drawWithCircles}>Draw with Circles</button>
      <button onClick={()=>setDrawFunction(() => drawWithLines)}>Draw with Lines</button>
    </main>
  );
}
