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

  let translation!: DOMMatrix;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    const points = [
      new DOMPoint(0, 5),
      new DOMPoint(0, -5),
      new DOMPoint(-5, 0),
      new DOMPoint(5, 0),
    ];
    for (const point of points) {
      const translated = translation.transformPoint(point);
      ctx.lineTo(translated.x, translated.y);
    }
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

    translation = translation.translate(e.movementX / translation.a, e.movementY / translation.a);

    draw();
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const reverseTranslation = translation.inverse();
    const offset = reverseTranslation.transformPoint(
      new DOMPoint(e.offsetX, e.offsetY),
    );

    const magnitude = e.deltaY > 0 ? 10 / 9 : 9 / 10;

    translation = translation
      .translate(offset.x, offset.y)
      .scale3d(magnitude)
      .translate(-offset.x, -offset.y);

    draw();
  }

  onMount(() => {
    setupCanvas();
    translation = new DOMMatrix();
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
