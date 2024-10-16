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
  const transformPointInvertedY = (p: DOMPoint) =>
    translation.scale(1, -1).transformPoint(p);

  let truss!: {
    points: DOMPoint[];
    members: [number, number][];
  };

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";

    for (const member of truss.members) {
      const start = transformPointInvertedY(truss.points[member[0]]);
      const end = transformPointInvertedY(truss.points[member[1]]);
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    }
    ctx.stroke();

    ctx.fillStyle = "red";
    for (const point of truss.points) {
      const translated = transformPointInvertedY(point);
      ctx.beginPath();
      ctx.arc(translated.x, translated.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function handleMouseMove(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (e.buttons & 4) {
      const inverse = translation.inverse();

      const moveStart = inverse.transformPoint(
        new DOMPoint(e.offsetX - e.movementX, e.offsetY - e.movementY),
      );
      const moveEnd = inverse.transformPoint(
        new DOMPoint(e.offsetX, e.offsetY),
      );

      translation = translation.translate(
        moveEnd.x - moveStart.x,
        moveEnd.y - moveStart.y,
      );

      draw();
    }
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const reverseTranslation = translation.inverse();
    const offset = reverseTranslation.transformPoint(
      new DOMPoint(e.offsetX, e.offsetY),
    );

    const magnitude = -e.deltaY > 0 ? 10 / 9 : 9 / 10;

    translation = translation
      .translate(offset.x, offset.y)
      .scale3d(magnitude)
      .translate(-offset.x, -offset.y);

    draw();
  }

  onMount(() => {
    setupCanvas();
    translation = new DOMMatrix().scale3d(500).translate(0.9, 1.4);
    translation = translation;
    truss = {
      points: [
        new DOMPoint(0, 0),
        new DOMPoint(1, 0),
        new DOMPoint(2, 0),
        new DOMPoint(0.5, Math.sqrt(3) / 2),
        new DOMPoint(1.5, Math.sqrt(3) / 2),
      ],
      members: [
        [0, 1],
        [0, 3],
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 4],
        [3, 4],
      ],
    };
    draw();
    console.log("setup canvas!");
  });
  return (
    <canvas
      ref={canvas}
      on:mousemove={handleMouseMove}
      on:wheel={handleWheel}
      on:contextmenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={props.style}
      class={props.class}
    ></canvas>
  );
}
