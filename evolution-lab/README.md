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

```text
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