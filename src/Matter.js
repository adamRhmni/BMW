// physicsWorld.js
import {
    Engine, Render, Runner, World, Bodies, Body,
    Events, Mouse, MouseConstraint
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
  
    const ground = Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true });
    const wallLeft = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true });
    const wallRight = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true });
  
    World.add(world, [ground, ceiling, wallLeft, wallRight]);
  
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.9, render: { visible: false } },
    });
    World.add(world, mouseConstraint);
    render.mouse = mouse;
  
    render.canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
  
    function addRandomShape(x, y) {
      const type = Math.floor(Math.random() * 3);
      let shape;
      if (type === 0) {
        shape = Bodies.circle(x, y, 30, { restitution: 0.9, render: { fillStyle: "#005bac" } });
        shape = Bodies.circle(x, y, 30, { restitution: 0.9, render: { fillStyle: "#005bac" } });
      } else if (type === 1) {
        shape = Bodies.rectangle(x, y, 60, 40, { restitution: 0.7, render: { fillStyle: "#a50021" } });
      } else {
        shape = Bodies.polygon(x, y, 5, 25, { restitution: 0.8, render: { fillStyle: "#4d4c4a" } });
      }
      World.add(world, shape);
    }
  
    for (let i = 0; i < 10; i++) {
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
  