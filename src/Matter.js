// physicsWorld.js
import {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Body,
  Events,
  Mouse,
  MouseConstraint,
} from "matter-js";

export function createPhysicsWorld(container) {
  const engine = Engine.create();
  const world = engine.world;
  const runner = Runner.create();
  Runner.run(runner, engine);

  const render = Render.create({
    element: container,
    engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: "transparent",
    },
  });

  render.canvas.id = "matterRenderCanvas";
  Render.run(render);

  const wallThickness = 80;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const ground = Bodies.rectangle(
    width / 2,
    height + wallThickness / 2,
    width,
    wallThickness,
    { isStatic: true }
  );
  const ceiling = Bodies.rectangle(
    width / 2,
    -wallThickness / 2,
    width,
    wallThickness,
    { isStatic: true }
  );
  const wallLeft = Bodies.rectangle(
    -wallThickness / 2,
    height / 2,
    wallThickness,
    height,
    { isStatic: true }
  );
  const wallRight = Bodies.rectangle(
    width + wallThickness / 2,
    height / 2,
    wallThickness,
    height,
    { isStatic: true }
  );

  World.add(world, [ground, ceiling, wallLeft, wallRight]);

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.9, render: { visible: false } },
  });
  World.add(world, mouseConstraint);
  render.mouse = mouse;

  render.canvas.addEventListener("touchmove", (e) => e.preventDefault(), {
    passive: false,
  });

  function addRandomShape(x, y) {
    const type = Math.floor(Math.random() * 5);
    let shape;
    const colors = [
      "#f9fafb", // star white
      "#ff006e", // magenta nebula
      "#8338ec", // purple nebula
      "#3a86ff", // blue
      "#fb5607", // orange
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];

    if (type === 0) {
      // Star-like circle
      shape = Bodies.circle(x, y, 12, {
        restitution: 0.95,
        render: { fillStyle: color },
      });
    } else if (type === 1) {
      // Rectangle
      shape = Bodies.rectangle(x, y, 30, 20, {
        restitution: 0.7,
        render: { fillStyle: color },
      });
    } else if (type === 2) {
      // Pentagon
      shape = Bodies.polygon(x, y, 5, 25, {
        restitution: 0.8,
        render: { fillStyle: color },
      });
    } else if (type === 3) {
      // Star shape using polygon (approximation with 10 points)
      shape = Bodies.polygon(x, y, 10, 20, {
        restitution: 0.9,
        render: { fillStyle: color },
      });
    } else {
      // Triangle
      shape = Bodies.polygon(x, y, 3, 25, {
        restitution: 0.85,
        render: { fillStyle: color },
      });
    }

    World.add(world, shape);
  }

  for (let i = 0; i < 25; i++) {
    addRandomShape(Math.random() * width, Math.random() * 100);
  }

  function cleanupMatter() {
    Runner.stop(runner);
    World.clear(world, false);
    Engine.clear(engine);
    render.canvas.remove();
    render.textures = {};
  }

  return { engine, world, render, addRandomShape, cleanupMatter };
}
