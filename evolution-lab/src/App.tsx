import { useEffect, useRef, useState } from "react";
import "./index.css";

type Organism = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  size: number;
  fitness: number;
};

type Target = {
  x: number;
  y: number;
};

type HistoryPoint = {
  generation: number;
  fitness: number;
};

const WIDTH = 760;
const HEIGHT = 480;
const GENERATION_LENGTH = 5000;

function randomDirection() {
  const angle = Math.random() * Math.PI * 2;

  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

function createOrganism(): Organism {
  const direction = randomDirection();

  return {
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    vx: direction.x,
    vy: direction.y,
    speed: 0.8 + Math.random() * 1.2,
    size: 3 + Math.random() * 2,
    fitness: 0,
  };
}

function createPopulation(count: number) {
  return Array.from({ length: count }, createOrganism);
}

function createTarget(): Target {
  return {
    x: WIDTH * 0.75,
    y: HEIGHT * 0.5,
  };
}

function calculateFitness(
  organism: Organism,
  target: Target
) {
  const distance = Math.sqrt(
    Math.pow(organism.x - target.x, 2) +
      Math.pow(organism.y - target.y, 2)
  );

  const maximumDistance = Math.sqrt(
    WIDTH * WIDTH +
      HEIGHT * HEIGHT
  );

  return Math.max(
    0,
    1 - distance / maximumDistance
  );
}

function reproduce(
  organisms: Organism[],
  target: Target,
  mutationRate: number
) {
  const ranked = [...organisms]
    .map((organism) => ({
      ...organism,
      fitness: calculateFitness(organism, target),
    }))
    .sort((a, b) => b.fitness - a.fitness);

  const survivors = ranked.slice(
    0,
    Math.max(2, Math.floor(ranked.length * 0.2))
  );

  const nextGeneration: Organism[] = [];

  while (nextGeneration.length < organisms.length) {
    const parent =
      survivors[Math.floor(Math.random() * survivors.length)];

    const mutation = mutationRate / 100;

    const vx =
      parent.vx +
      (Math.random() - 0.5) * mutation;

    const vy =
      parent.vy +
      (Math.random() - 0.5) * mutation;

    const speed =
      parent.speed +
      (Math.random() - 0.5) * mutation;

    const magnitude = Math.sqrt(vx * vx + vy * vy);

    nextGeneration.push({
      x: Math.random() * WIDTH * 0.15,
      y: Math.random() * HEIGHT,
      vx: vx / magnitude,
      vy: vy / magnitude,
      speed: Math.max(0.3, Math.min(3, speed)),
      size: parent.size,
      fitness: 0,
    });
  }

  return nextGeneration;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [population, setPopulation] = useState(80);
  const [mutationRate, setMutationRate] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [generation, setGeneration] = useState(1);
  const [bestFitness, setBestFitness] = useState(0);
  const [paused, setPaused] = useState(false);

  const [fitnessHistory, setFitnessHistory] = useState<
    HistoryPoint[]
  >([]);

  const organismsRef = useRef<Organism[]>(
    createPopulation(80)
  );

  const targetRef = useRef<Target>(createTarget());

  const bestPathRef = useRef<
    { x: number; y: number }[]
  >([]);

  useEffect(() => {
    organismsRef.current =
      createPopulation(population);

    bestPathRef.current = [];

    setGeneration(1);
    setBestFitness(0);
    setFitnessHistory([]);
  }, [population]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    let animationFrame: number;
    let lastTime = performance.now();
    let generationTimer = 0;

    const animate = (time: number) => {
      const delta = Math.min(
        time - lastTime,
        50
      );

      lastTime = time;

      context.fillStyle = "#111315";
      context.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
      );

      const target = targetRef.current;

      if (!paused) {
        generationTimer +=
          delta * speed;

        organismsRef.current.forEach(
          (organism) => {
            const dx =
              target.x - organism.x;

            const dy =
              target.y - organism.y;

            const distance = Math.sqrt(
              dx * dx + dy * dy
            );

            if (distance > 15) {
              organism.vx +=
                (dx / distance) * 0.002;

              organism.vy +=
                (dy / distance) * 0.002;
            }

            const magnitude = Math.sqrt(
              organism.vx *
                organism.vx +
                organism.vy *
                  organism.vy
            );

            organism.vx /= magnitude;
            organism.vy /= magnitude;

            organism.x +=
              organism.vx *
              organism.speed *
              speed;

            organism.y +=
              organism.vy *
              organism.speed *
              speed;

            organism.x = Math.max(
              0,
              Math.min(WIDTH, organism.x)
            );

            organism.y = Math.max(
              0,
              Math.min(HEIGHT, organism.y)
            );

            organism.fitness =
              calculateFitness(
                organism,
                target
              );
          }
        );

        // Find the current best organism.
        const currentBest =
          organismsRef.current.reduce(
            (best, organism) =>
              organism.fitness >
              best.fitness
                ? organism
                : best,
            organismsRef.current[0]
          );

        if (currentBest) {
          bestPathRef.current.push({
            x: currentBest.x,
            y: currentBest.y,
          });

          // Keep the trail manageable.
          if (
            bestPathRef.current.length >
            180
          ) {
            bestPathRef.current.shift();
          }
        }

        if (
          generationTimer >=
          GENERATION_LENGTH
        ) {
          generationTimer = 0;

          const fitnessValues =
            organismsRef.current.map(
              (organism) =>
                calculateFitness(
                  organism,
                  target
                )
            );

          const best = Math.max(
            ...fitnessValues
          );

          const displayFitness = best * 100;

          setBestFitness(
            displayFitness
          );

          setFitnessHistory(
            (history) => [
              ...history,
              {
                generation,
                fitness:
                  displayFitness,
              },
            ].slice(-30)
          );

          organismsRef.current =
            reproduce(
              organismsRef.current,
              target,
              mutationRate
            );

          bestPathRef.current = [];

          setGeneration(
            (current) =>
              current + 1
          );
        }
      }

      /*
       * Draw best organism path
       */
      if (
        bestPathRef.current.length > 1
      ) {
        context.beginPath();

        bestPathRef.current.forEach(
          (point, index) => {
            if (index === 0) {
              context.moveTo(
                point.x,
                point.y
              );
            } else {
              context.lineTo(
                point.x,
                point.y
              );
            }
          }
        );

        context.strokeStyle =
          "rgba(185, 200, 189, 0.22)";
        context.lineWidth = 1;
        context.stroke();
      }

      /*
       * Draw target
       */
      context.beginPath();

      context.arc(
        target.x,
        target.y,
        8,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        "#b9c8bd";

      context.fill();

      context.beginPath();

      context.arc(
        target.x,
        target.y,
        15,
        0,
        Math.PI * 2
      );

      context.strokeStyle =
        "#52635a";

      context.lineWidth = 1;
      context.stroke();

      /*
       * Draw organisms based on fitness
       */
      organismsRef.current.forEach(
        (organism) => {
          const normalizedFitness =
  organism.fitness;

          const brightness =
            125 +
            normalizedFitness * 90;

          const alpha =
            0.45 +
            normalizedFitness * 0.55;

          context.beginPath();

          context.arc(
            organism.x,
            organism.y,
            organism.size +
              normalizedFitness * 1.2,
            0,
            Math.PI * 2
          );

          context.fillStyle = `rgba(
            ${Math.round(brightness)},
            ${Math.round(
              brightness + 12
            )},
            ${Math.round(
              brightness + 4
            )},
            ${alpha}
          )`;

          context.fill();
        }
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    animationFrame =
      requestAnimationFrame(
        animate
      );

    return () =>
      cancelAnimationFrame(
        animationFrame
      );
  }, [
    paused,
    speed,
    mutationRate,
    generation,
  ]);

  const resetSimulation = () => {
    organismsRef.current =
      createPopulation(population);

    bestPathRef.current = [];

    setGeneration(1);
    setBestFitness(0);
    setFitnessHistory([]);
  };

  const maxFitness =
    fitnessHistory.length > 0
      ? Math.max(
          ...fitnessHistory.map(
            (point) => point.fitness
          ),
          1
        )
      : 1;

  const chartWidth = 700;
  const chartHeight = 180;

  const chartPoints =
    fitnessHistory
      .map((point, index) => {
        const x =
          fitnessHistory.length === 1
            ? chartWidth / 2
            : (index /
                (fitnessHistory.length - 1)) *
              chartWidth;

        const y =
          chartHeight -
          (point.fitness / maxFitness) *
            (chartHeight - 20);

        return `${x},${y}`;
      })
      .join(" ");

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Evolution Lab</h1>

          <p>
            Natural selection simulation
          </p>
        </div>

        <div className="generation">
          Generation{" "}
          <strong>
            {generation}
          </strong>
        </div>
      </header>

      <section className="workspace">
        <div className="simulation">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
          />
        </div>

        <aside className="controls">
          <h2>Simulation</h2>

          <div className="stat">
            <span>
              Population
            </span>

            <strong>
              {population}
            </strong>
          </div>

          <div className="stat">
            <span>
              Generation
            </span>

            <strong>
              {generation}
            </strong>
          </div>

          <div className="stat">
            <span>
              Best fitness
            </span>

            <strong>
              {bestFitness.toFixed(1)}
            </strong>
          </div>

          <label>
            <div>
              <span>
                Mutation rate
              </span>

              <strong>
                {mutationRate}%
              </strong>
            </div>

            <input
              type="range"
              min="0"
              max="30"
              value={mutationRate}
              onChange={(event) =>
                setMutationRate(
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </label>

          <label>
            <div>
              <span>
                Population
              </span>

              <strong>
                {population}
              </strong>
            </div>

            <input
              type="range"
              min="20"
              max="150"
              value={population}
              onChange={(event) =>
                setPopulation(
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </label>

          <label>
            <div>
              <span>
                Simulation speed
              </span>

              <strong>
                {speed}×
              </strong>
            </div>

            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(event) =>
                setSpeed(
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </label>

          <div className="buttons">
            <button
              onClick={() =>
                setPaused(
                  (value) => !value
                )
              }
            >
              {paused
                ? "Resume"
                : "Pause"}
            </button>

            <button
              className="secondary"
              onClick={
                resetSimulation
              }
            >
              Reset
            </button>
          </div>
        </aside>
      </section>

      <section className="analysis-panel">
        <div className="analysis-header">
          <div>
            <h2>Fitness history</h2>

            <p>
              Best-performing organism
              across generations
            </p>
          </div>

          <span>
            {fitnessHistory.length} samples
          </span>
        </div>

        <div className="chart">
          {fitnessHistory.length > 0 ? (
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1={chartHeight - 1}
                x2={chartWidth}
                y2={chartHeight - 1}
                stroke="#2b302e"
              />

              <polyline
                points={chartPoints}
                fill="none"
                stroke="#9db7a5"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          ) : (
            <div className="empty-chart">
              Waiting for the first
              generation...
            </div>
          )}
        </div>
      </section>

      <section className="footer-info">
        <div>
          <span>Mutation</span>

          <strong>
            {mutationRate}%
          </strong>
        </div>

        <div>
          <span>Status</span>

          <strong>
            {paused
              ? "Paused"
              : "Running"}
          </strong>
        </div>

        <div>
          <span>Target</span>

          <strong>
            Active
          </strong>
        </div>

        <div>
          <span>Selection</span>

          <strong>
            Top 20%
          </strong>
        </div>
      </section>
    </main>
  );
}

export default App;