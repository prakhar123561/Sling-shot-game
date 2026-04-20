import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Constraint,
  Mouse,
  MouseConstraint,
  Events,
  World
} = Matter;

interface SlingShotGameProps {
  onScoreUpdate: (score: number) => void;
}

export const SlingShotGame: React.FC<SlingShotGameProps> = ({ onScoreUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  
  const [gameState, setGameState] = useState<'idle' | 'aiming' | 'flying'>('idle');
  const [shake, setShake] = useState(0);

  // Refs for physics objects to avoid closure issues in event handlers
  const physicsRefs = useRef<{
    projectile: Matter.Body | null;
    slingshot: Matter.Constraint | null;
    targets: Matter.Body[];
    anchor: { x: number; y: number };
    isFiring: boolean;
  }>({
    projectile: null,
    slingshot: null,
    targets: [],
    anchor: { x: 150, y: 350 },
    isFiring: false,
  });

  const BASE_WIDTH = 800;
  const BASE_HEIGHT = 600;

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // Helper to scale content based on container size
    const updateContainerSize = () => {
      if (!containerRef.current || !renderRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      renderRef.current.options.width = width;
      renderRef.current.options.height = height;
      renderRef.current.canvas.width = width * (window.devicePixelRatio || 1);
      renderRef.current.canvas.height = height * (window.devicePixelRatio || 1);
      renderRef.current.canvas.style.width = `${width}px`;
      renderRef.current.canvas.style.height = `${height}px`;

      // Update anchor position relative to new size
      physicsRefs.current.anchor = { x: width * 0.2, y: height * 0.7 };
    };

    const resizeObserver = new ResizeObserver(() => {
      updateContainerSize();
    });
    resizeObserver.observe(containerRef.current);

    // 1. Initial Setup
    updateContainerSize();
    const anchor = physicsRefs.current.anchor;

    // 2. Ground
    const ground = Bodies.rectangle(400, 600, 2000, 60, {
      isStatic: true,
      label: 'ground',
      render: { fillStyle: '#0f172a' }
    });

    // 3. Targets
    const createStack = () => {
      const width = render.options.width || BASE_WIDTH;
      const height = render.options.height || BASE_HEIGHT;
      const stack = [];
      const cols = 5;
      const rows = 8;
      const startX = width * 0.75;
      const startY = height - 60 - (rows * 40);
      const blockSize = 40;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          stack.push(
            Bodies.rectangle(
              startX + c * blockSize,
              startY + r * blockSize,
              blockSize - 1,
              blockSize - 1,
              {
                restitution: 0.1,
                friction: 1,
                render: {
                  fillStyle: `hsl(160, ${70 - r * 5}%, ${40 + r * 2}%)`,
                  strokeStyle: '#020617',
                  lineWidth: 1
                },
                label: 'target'
              }
            )
          );
        }
      }
      return stack;
    };

    const targets = createStack();
    physicsRefs.current.targets = targets;

    // 4. Projectile & Slingshot
    const createProjectile = () => {
      const p = Bodies.circle(anchor.x, anchor.y, 15, {
        density: 0.005,
        restitution: 0.5,
        friction: 0.1,
        render: { fillStyle: '#10b981' },
        label: 'projectile'
      });
      
      const s = Constraint.create({
        pointA: anchor,
        bodyB: p,
        stiffness: 0.12,
        damping: 0.08,
        render: { visible: false }
      });
      
      physicsRefs.current.projectile = p;
      physicsRefs.current.slingshot = s;
      return [p, s];
    };

    const [projectile, slingshot] = createProjectile();

    Composite.add(world, [ground, ...targets, projectile, slingshot]);

    // 5. Mouse Interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(world, mouseConstraint);

    // Fix mouse offset for responsive canvas
    Events.on(mouseConstraint, 'mousedown', () => {
      if (gameState === 'idle') setGameState('aiming');
    });

    Events.on(mouseConstraint, 'mouseup', () => {
      if (gameState === 'aiming') {
        physicsRefs.current.isFiring = true;
        setGameState('flying');
      }
    });

    // 6. Game Logic Update
    Events.on(engine, 'afterUpdate', () => {
      const { projectile, slingshot, isFiring, targets } = physicsRefs.current;
      if (!projectile) return;

      // Release logic
      if (isFiring && projectile.position.x > anchor.x + 20 && slingshot) {
        Composite.remove(world, slingshot);
        physicsRefs.current.slingshot = null;
        physicsRefs.current.isFiring = false;
        
        // Final score check after delay
        setTimeout(() => checkScore(targets), 4000);
      }

      // Out of bounds or dead settle
      if (
        projectile.position.x > render.options.width + 200 || 
        projectile.position.x < -200 || 
        projectile.position.y > render.options.height + 200
      ) {
        resetProjectile();
      }
    });

    // 7. Visual Juice: Collision Effects
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        if (pair.bodyA.label === 'projectile' || pair.bodyB.label === 'projectile') {
          // Intense shake on impact
          const impact = pair.collision.depth;
          if (impact > 2) setShake(impact * 2);
        }
      });
    });

    // 8. Custom Rendering
    Events.on(render, 'afterRender', () => {
      const { slingshot, projectile, anchor } = physicsRefs.current;
      const ctx = render.context;
      
      // Slingshot Frame
      ctx.beginPath();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 10;
      ctx.moveTo(anchor.x, anchor.y + 10);
      ctx.lineTo(anchor.x, render.options.height - 20);
      ctx.stroke();

      if (slingshot && projectile) {
        const pos = projectile.position;
        // Elastic bands
        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.moveTo(anchor.x, anchor.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 6;
        ctx.moveTo(anchor.x, anchor.y);
        ctx.lineTo(pos.x - 4, pos.y);
        ctx.stroke();
      }
    });

    const checkScore = (allTargets: Matter.Body[]) => {
      let fallenCount = 0;
      const height = render.options.height || BASE_HEIGHT;
      allTargets.forEach(target => {
        if (target.position.y > height - 40 || Math.abs(target.angle) > 0.4) {
          fallenCount++;
        }
      });
      onScoreUpdate(fallenCount * 100);
    };

    const resetProjectile = () => {
      const { world } = engine;
      if (physicsRefs.current.projectile) Composite.remove(world, physicsRefs.current.projectile);
      if (physicsRefs.current.slingshot) Composite.remove(world, physicsRefs.current.slingshot);
      
      const [p, s] = createProjectile();
      Composite.add(world, [p, s]);
      setGameState('idle');
    };

    const fullReset = () => {
      const currentTargets = Composite.allBodies(world).filter(b => b.label === 'target');
      Composite.remove(world, currentTargets);
      const newTargets = createStack();
      Composite.add(world, newTargets);
      physicsRefs.current.targets = newTargets;
      resetProjectile();
      onScoreUpdate(0);
    };

    // External listener for Reset (from Bento FIRE button)
    const handleReset = () => fullReset();
    window.addEventListener('reset-game', handleReset);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Decay shake over time
    const shakeLoop = setInterval(() => {
      setShake(s => Math.max(0, s * 0.9));
    }, 16);

    return () => {
      window.removeEventListener('reset-game', handleReset);
      resizeObserver.disconnect();
      clearInterval(shakeLoop);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      World.clear(world, false);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative bg-[#020617] cursor-crosshair overflow-hidden"
      style={{
        transform: `translate(${Math.random() * shake - shake/2}px, ${Math.random() * shake - shake/2}px)`
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Dynamic HUD elements */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
        {gameState === 'idle' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
            <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-bold">Awaiting_Input</span>
          </div>
        )}
        {gameState === 'aiming' && (
          <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full backdrop-blur-sm">
            <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase font-bold">Acquiring_Vector...</span>
          </div>
        )}
      </div>
    </div>
  );
};


