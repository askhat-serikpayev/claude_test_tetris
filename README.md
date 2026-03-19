# Tetris

Full-stack Tetris game with React + TypeScript frontend and Express + SQLite backend.

## Quick Start

```bash
# Install all dependencies
cd server && npm install && cd ../client && npm install && cd ..
npm install

# Run both server and client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Architecture

```
tetris/
  client/              # React 18 + Vite + TypeScript
    src/
      components/      # React UI components
      game/            # Pure game engine (Board, Tetromino, GameEngine, Renderer)
      hooks/           # useGameLoop, useKeyboard
      services/        # REST API client
      types/           # TypeScript interfaces and enums
  server/              # Express + TypeScript + SQLite
    src/
      controllers/     # Route handlers
      services/        # Business logic
      models/          # Data models
      routes/          # Express routers
      middleware/      # Error handling, validation
      config/          # App & database config
```

## API Endpoints

| Method | Endpoint                 | Description          |
|--------|--------------------------|----------------------|
| POST   | `/api/scores`            | Submit a new score   |
| GET    | `/api/scores/leaderboard`| Top 10 scores        |
| GET    | `/api/scores/:id`        | Get score by ID      |
| DELETE | `/api/scores/:id`        | Delete a score       |

## Game Controls

| Key              | Action           |
|------------------|------------------|
| Arrow Left / A   | Move left        |
| Arrow Right / D  | Move right       |
| Arrow Down / S   | Soft drop        |
| Arrow Up / W     | Rotate clockwise |
| Z                | Rotate CCW       |
| Space            | Hard drop        |
| C / Shift        | Hold piece       |
| P / Esc          | Pause            |
| R                | Restart (game over) |

## Features

- All 7 tetrominoes with SRS (Super Rotation System) wall kicks
- Ghost piece, hold piece, next 3 preview
- Progressive speed increase per level
- Line scoring with level multiplier
- Persistent leaderboard via REST API
- Responsive dark theme UI

## Docker

```bash
docker-compose up --build
```
