# Evolution Lab

An interactive natural selection simulation built with React and TypeScript.

Evolution Lab demonstrates how a population can improve over multiple generations through selection, inheritance, and mutation. Organisms are evaluated according to how effectively they move toward a target, and the highest-performing organisms are used to produce the next generation.

## Overview

The simulation starts with a randomly generated population of organisms.

Each organism has movement-related traits:

- Position
- Movement direction
- Speed
- Size
- Fitness

During each generation, organisms move through the environment and are evaluated according to their distance from the target.

The best-performing organisms are selected for reproduction. Their traits are inherited by the next generation, with small mutations introduced during reproduction.

Over time, the population adapts toward the target.

## How Evolution Works

The simulation follows this cycle:

Random Population
       ↓
   Movement
       ↓
 Fitness Evaluation
       ↓
 Rank Organisms
       ↓
 Select Top 20%
       ↓
     Reproduce
       ↓
      Mutate
       ↓
 New Generation
       ↓
     Repeat

This creates a simple model of natural selection that can be observed in real time.

## Fitness

Fitness is calculated from the distance between an organism and the target.

The distance is normalized against the maximum possible distance in the simulation:

fitness = 1 - distance / maximumDistance

The resulting value is between 0 and 1.

The interface displays it as a percentage:

- 100% represents an organism at the target
- Lower values represent organisms farther from the target

## Features

### Real-Time Evolution

Watch the population move and adapt continuously across generations.

### Natural Selection

Only the top 20% of organisms are selected as parents for the next generation.

### Mutation

Movement direction and speed can change slightly when new organisms are created.

### Adjustable Population

The population size can be changed while the simulation is running.

### Adjustable Mutation Rate

The mutation rate can be controlled through the interface.

### Simulation Speed

The simulation can be slowed down or accelerated to observe the evolutionary process.

### Best Organism Tracking

A subtle trajectory shows the recent movement of the best-performing organism.

### Fitness History

The best fitness from each generation is recorded and displayed as a graph, making population improvement visible over time.

### Pause and Reset

The simulation can be paused for observation or reset to a new population.

## Technology

- React
- TypeScript
- Vite
- HTML Canvas API
- CSS

## Technical Implementation

The simulation uses the browser's requestAnimationFrame API to update and render organisms continuously.

The rapidly changing organism data is stored using React refs rather than React state, avoiding unnecessary component re-renders on every animation frame.

The Canvas API is responsible for rendering:

- Organisms
- Target
- Best-organism trajectory
- Simulation environment

React state is used for interface-level information such as:

- Population size
- Mutation rate
- Simulation speed
- Generation number
- Best fitness
- Simulation status
- Fitness history

## Selection Process

At the end of every generation, the organisms are ranked according to fitness.

The highest-performing 20% become the survivor pool.

New organisms are then created by selecting parents from this survivor pool and inheriting their traits.

Small random mutations are applied to movement direction and speed.

The new population starts from the left side of the environment, allowing the process to repeat under the same selection pressure.

## Project Structure

evolution-lab/
├── public/
├── src/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

## Running Locally

Clone the repository:

git clone https://github.com/shivanyaarunachalam/evolution-lab.git

Move into the project directory:

cd evolution-lab

Install dependencies:

npm install

Start the development server:

npm run dev

The application will be available at the local address provided by Vite.

## Production Build

Create a production build with:

npm run build

Preview the production build with:

npm run preview

## Why I Built This

Many algorithmic concepts are difficult to understand when they are presented only as formulas or code.

Evolution Lab was built to make the underlying process observable.

Instead of simply calculating an evolutionary result, the application allows the user to watch a population change over time and see how selection affects its behavior.

## Future Improvements

Potential extensions include:

- Obstacles within the environment
- Multiple targets
- Different fitness functions
- Configurable selection percentages
- Additional evolving traits
- Population statistics
- Generation comparison
- Simulation data export
- More complex evolutionary strategies

## Author

**Shivanya Arunachalam**

Computer Science and Engineering Student

GitHub: https://github.com/shivanyaarunachalam