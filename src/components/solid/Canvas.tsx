import { onMount } from "solid-js";

export function Canvas(props: { style?: string; class?: string }) {
  let canvas!: HTMLCanvasElement;
  let ctx!: CanvasRenderingContext2D;

  function setupCanvas() {
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();
    console.log(rect, dpr);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.moveTo(bottom.x, bottom.y);
    ctx.lineTo(top.x, top.y);
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }

  let isMouseDown = false;
  let startPoint = { x: 0, y: 0 };

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    isMouseDown = true;
    console.log("mouse down");
  }

  function handleMouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    isMouseDown = false;
    console.log("mouse up");
  }

  function handleMouseOut(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    isMouseDown = false;
    console.log("mouse up");
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isMouseDown) return;
    e.preventDefault();
    e.stopPropagation();

    draw();
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    draw();
  }

  onMount(() => {
    setupCanvas();
    getCanvasOffset();
    draw();
    console.log("setup canvas!");
  });
  return (
    <canvas
      ref={canvas}
      on:mousedown={handleMouseDown}
      on:mousemove={handleMouseMove}
      on:mouseup={handleMouseUp}
      on:mouseout={handleMouseOut}
      on:wheel={handleWheel}
      style={props.style}
      class={props.class}
    ></canvas>
  );
}
