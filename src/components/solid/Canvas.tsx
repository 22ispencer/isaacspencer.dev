import { onMount } from "solid-js";
function Canvas() {
  let canvas!: HTMLCanvasElement;
  let ctx!: CanvasRenderingContext2D;

  function setupCanvas(canvas: HTMLCanvasElement) {
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
  }

  let canvasOffsetX: number;
  let canvasOffsetY: number;
  function reOffset() {
    const boundingBox = canvas.getBoundingClientRect();
    canvasOffsetX = boundingBox.left;
    canvasOffsetY = boundingBox.top;
  }
  reOffset();
  window.onscroll = (_) => {
    reOffset();
  };
  window.onresize = (_) => {
    reOffset();
  };

  let isDown = false;
  let startX: number, startY: number;

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startX = e.clientX - canvasOffsetX;
    startY = e.clientY - canvasOffsetY;

    isDown = true;
  }

  function handleMouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    isDown = false;
  }

  function handleMouseOut(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    isDown = false;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDown) return;

    e.preventDefault();
    e.stopPropagation();

    const mouseX = e.clientX - canvasOffsetX;
    const mouseY = e.clientY - canvasOffsetY;

    const dx = mouseX - startX;
    const dy = mouseY - startY;

    startX = mouseX;
    startY = mouseY;
  }

  onMount(() => { });
  return (
    <canvas
      ref={canvas}
      on:mousedown={handleMouseDown}
      on:mousemove={handleMouseMove}
      on:mouseup={handleMouseUp}
      on:mouseout={handleMouseOut}
    ></canvas>
  );
}
