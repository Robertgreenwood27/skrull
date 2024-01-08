import React, { useRef, useEffect } from 'react';

const SpiderWebCanvas = ({ width, height }) => {
  const canvasRef = useRef(null);

  // Function to draw the web
  const drawWeb = (ctx, nodes) => {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 5, 0, Math.PI * 2, true); // Center node
    ctx.fillStyle = '#000';
    ctx.fill();

    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(node.x, node.y);
      ctx.strokeStyle = '#555';
      ctx.stroke();
      drawNode(ctx, node.x, node.y);
    });
  };

  // Function to draw nodes
  const drawNode = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2, true);
    ctx.fillStyle = '#999';
    ctx.fill();
  };

  // Initialize and set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Calculate node positions and draw the web
    const nodes = Array.from({ length: 6 }, (_, i) => ({
      x: width / 2 + 200 * Math.cos((Math.PI * 2 / 6) * i),
      y: height / 2 + 200 * Math.sin((Math.PI * 2 / 6) * i),
    }));
    drawWeb(ctx, nodes);

    // Event handlers
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2, true);

        if (ctx.isPointInPath(mouseX, mouseY)) {
          ctx.fillStyle = 'red';
        } else {
          ctx.fillStyle = '#999';
        }
        ctx.fill();
      });
    };

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2, true);

        if (ctx.isPointInPath(mouseX, mouseY)) {
          alert(`Clicked on node! Implement navigation here.`);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Clean up event listeners
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default function App() {
  // You can make these dynamic or based on the window size
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  return (
    <div className="App">
      <SpiderWebCanvas width={canvasWidth} height={canvasHeight} />
    </div>
  );
}
