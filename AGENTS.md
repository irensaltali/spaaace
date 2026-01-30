# Spaaace - AGENTS.md

## Project Overview

**Spaaace** is an HTML5 multiplayer space shooter game built with the [Lance](http://lance.gg) game server framework. It is a real-time browser-based game where players control spaceships, shoot missiles at each other, and compete for kills.

- **Repository**: https://github.com/irensaltali/spaaace
- **Version**: 4.0.0
- **License**: Apache-2.0
- **Live Demo**: http://spaaace.herokuapp.com

## Technology Stack

- **Runtime**: Node.js (>=18.0.0)
- **Game Framework**: [lance-gg](https://www.npmjs.com/package/lance-gg) (v4.0.8) - Multiplayer game server framework
- **Server**: Express.js (v4.21.2) + Socket.IO (v2.5.1) - *v2 required for lance-gg compatibility*
- **Client Rendering**: Pixi.js (v4.8.9) for 2D graphics, pixi-particles for effects
- **Audio**: Howler.js (v2.2.4)
- **Build Tools**: 
  - Webpack 5.104 (client bundling)
  - Babel 7.28 (ES6+ transpilation)
  - sass 1.97 (Dart Sass - SCSS compilation)
- **Code Quality**: ESLint with recommended config

## Project Structure

```
├── src/                      # Source code
│   ├── main.js               # Server entry point - Express server setup
│   ├── client/               # Client-side code (runs in browser)
│   │   ├── clientEntryPoint.js   # Client entry point
│   │   ├── SpaaaceClientEngine.js # Client game engine
│   │   ├── SpaaaceRenderer.js     # Pixi.js renderer
│   │   ├── ShipActor.js           # Ship visual representation
│   │   ├── MobileControls.js      # Touch device controls
│   │   ├── ThrusterEmitter.json   # Particle config
│   │   └── ExplosionEmitter.json  # Particle config
│   ├── server/               # Server-side code
│   │   ├── SpaaaceServerEngine.js # Server game engine
│   │   ├── NameGenerator.js       # Bot name generation
│   │   └── NameSet.js             # Name data for generator
│   └── common/               # Shared code (runs on both client and server)
│       ├── SpaaaceGameEngine.js   # Core game logic
│       ├── Ship.js                # Ship game object
│       ├── Missile.js             # Missile game object
│       └── Utils.js               # Utility functions
├── dist/                     # Client build output (served as static files)
│   ├── index.html            # Main HTML page
│   └── assets/               # Game assets (images, audio, scss)
├── dist-server/              # Server build output (Node.js runnable)
├── scripts/                  # Deployment scripts
│   ├── npm-install.sh        # AWS CodeDeploy install hook
│   └── npm-start.sh          # AWS CodeDeploy start hook
├── package.json              # NPM configuration
├── webpack.config.js         # Webpack configuration
├── babel.config.js           # Babel configuration
├── .eslintrc.js              # ESLint configuration
└── appspec.yml               # AWS CodeDeploy specification
```

## Architecture

### Client-Server Model

This is a multiplayer game using the **authoritative server** pattern:

1. **Client** (`src/client/`): Handles user input, renders graphics, plays sounds
2. **Server** (`src/server/`): Authoritative game state, collision detection, bot AI
3. **Common** (`src/common/`): Game objects (Ship, Missile) and core game logic shared between client and server

### Key Components

- **SpaaaceGameEngine** (`src/common/SpaaaceGameEngine.js`): Core game logic, physics, collision handling
- **SpaaaceServerEngine** (`src/server/SpaaaceServerEngine.js`): Server-side game management, player connections, scoring
- **SpaaaceClientEngine** (`src/client/SpaaaceClientEngine.js`): Client-side game loop, input handling, sound
- **SpaaaceRenderer** (`src/client/SpaaaceRenderer.js`): Pixi.js-based rendering, camera, UI updates

### Game Objects

- **Ship**: Player/Bot spacecraft with position, velocity, angle, thrust
- **Missile**: Projectile fired by ships, destroys ships on impact

### Network Synchronization

Uses Lance-gg's synchronization system with:
- Input prediction on client
- Server reconciliation
- Extrapolation for remote objects (configurable via URL query params)
- Bending for smooth corrections

## Build Commands

```bash
# Install dependencies and build everything
npm install

# Build client bundle (Webpack) and server (Babel)
npm run build

# Watch mode for development (rebuilds on file changes)
npm run dev

# Production build with stats
npm run stats

# Start the server (requires dist-server/ to exist)
npm start

# Start with debugging enabled
npm run start-debug

# Start with nodemon for development
npm run start-dev
```

## Build Process

### Client Build (Webpack)
- Entry: `src/client/clientEntryPoint.js`
- Output: `dist/bundle.js` (with source maps)
- Processes: ES6+ → Babel → Bundle, SCSS → CSS
- Includes assets from `dist/assets/`

### Server Build (Babel)
- Input: `src/` directory
- Output: `dist-server/` directory
- Transpiles ES6+ imports/exports to CommonJS for Node.js

### Post-Install Hook
`npm install` automatically runs `npm run build` via the `postinstall` script.

## Development Workflow

1. **First setup**: `npm install` (builds everything)
2. **Development**: 
   - Terminal 1: `npm run dev` (watch client files)
   - Terminal 2: `npm run start-dev` (server with auto-restart)
3. **Access**: Open http://localhost:3000 (or PORT env variable)

## Code Style Guidelines

ESLint configuration (`.eslintrc.js`):
- Extends: Google JavaScript Style Guide
- Indent: 4 spaces
- Line endings: Unix (LF)
- Max statements per line: 2
- Allows `console.log` (no-console: off)
- Allows TODO/FIXME comments (no-warning-comments: off)
- Single-line braces allowed

## Game Controls

### Desktop (Keyboard)
- **↑ Up Arrow**: Thrust forward
- **← Left Arrow**: Rotate left
- **→ Right Arrow**: Rotate right
- **Spacebar**: Fire missile

### Mobile (Touch)
- **Touch and drag**: Ship steers toward touch point
- **Two-finger touch or Fire button**: Fire missile

## URL Query Parameters

The game accepts various query parameters for testing:
- `sync=interpolate|extrapolate`: Sync mode
- `autostart`: Auto-join game on load
- `showworldbounds`: Show world boundary debug overlay
- `cameraroam`: Free camera mode (no player follow)

## Deployment

The project uses **AWS CodeDeploy** for deployment:

1. **appspec.yml**: Defines deployment hooks
2. **scripts/npm-install.sh**: 
   - Runs `npm install`
   - Syncs static files to S3 bucket
   - Invalidates CloudFront CDN cache
3. **scripts/npm-start.sh**:
   - Stops existing Node process
   - Starts new game server on port 3001

**Target Environment**: AWS EC2 (Amazon Linux) with game deployed to `/var/games/spaaace`

## Security Considerations

- No authentication/authorization system (public game)
- Bots run on server with `playerId: 0`
- Socket.IO for WebSocket communication with fallback
- Static assets served via Express with `express.static()`

## Testing

This project does **not** have automated tests. Testing is manual:
1. Start server locally
2. Open multiple browser tabs to simulate multiplayer
3. Test on mobile devices for touch controls

## Performance Notes

- **Update Rate**: Server updates at 6 ticks per second (configurable)
- **World Size**: 3000x3000 pixels with world wrapping
- **Collision**: Brute-force collision detection with 28px distance threshold
- **Bots**: 3 AI-controlled bots spawn automatically

## Dependencies to Know

Core game framework:
- `lance-gg`: Multiplayer game synchronization
- `pixi.js`: 2D rendering engine
- `socket.io`: Real-time bidirectional communication

Utilities:
- `query-string`: URL parameter parsing
- `eventemitter3`: Event handling (updated from deprecated `event-emitter`)
- `howler`: Audio playback
- `stream-http`, `url`, `stream-browserify`, etc.: Node.js polyfills for webpack 5

## File Naming Conventions

- Classes: PascalCase (e.g., `SpaaaceGameEngine.js`)
- Entry points: camelCase (e.g., `clientEntryPoint.js`)
- JSON configs: camelCase (e.g., `ThrusterEmitter.json`)
- Assets: lowercase (e.g., `ship1.png`, `space3.png`)
