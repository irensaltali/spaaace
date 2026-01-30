![spaaace](https://cloud.githubusercontent.com/assets/3951311/21784604/ffc2d282-d6c4-11e6-97f0-0ada12c4fab7.gif)

# Spaaace

An online HTML5 multiplayer space shooter built with [Lance](http://lance.gg) game server framework.

## Features

- **Real-time multiplayer** - Play with friends in a shared space arena
- **Bot AI** - 3 AI-controlled bots spawn automatically for solo play
- **Cross-platform** - Works on desktop (keyboard) and mobile (touch)
- **Self-hosted** - No external dependencies, runs entirely on your server
- **Modern stack** - Updated for Node.js 18+ with Webpack 5, Babel 7, and Socket.IO

## Quick Start

```bash
# Install dependencies (also builds the project)
npm install

# Start the server
npm start

# Open in browser
open http://localhost:3000
```

## Development

```bash
# Terminal 1: Watch client files
npm run dev

# Terminal 2: Run server with auto-restart
npm run start-dev
```

## Controls

### Desktop (Keyboard)
- **↑ Up Arrow** - Thrust forward
- **← Left Arrow** - Rotate left
- **→ Right Arrow** - Rotate right
- **Spacebar** - Fire missile

### Mobile (Touch)
- **Touch and drag** - Ship steers toward touch point
- **Two-finger touch** or **Fire button** - Fire missile

## URL Parameters

- `?autostart` - Auto-join game on load
- `?sync=interpolate` or `?sync=extrapolate` - Change network sync mode
- `?showworldbounds` - Show world boundary debug overlay
- `?cameraroam` - Free camera mode (no player follow)

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |

### Bot Count

Edit `src/server/SpaaaceServerEngine.js`:
```javascript
const NUM_BOTS = 3;  // Change to 0 to disable bots
```

## Technology Stack

- **Runtime**: Node.js (>=18.0.0)
- **Game Framework**: [lance-gg](https://www.npmjs.com/package/lance-gg) v4.0.9
- **Server**: Express.js v4.22.1 + Socket.IO v2.5.1
- **Client Rendering**: Pixi.js v4.8.9 + pixi-particles
- **Audio**: Howler.js v2.2.4
- **Build Tools**: Webpack 5.104 + Babel 7.28 + Sass 1.97

## Project Structure

```
├── src/
│   ├── client/          # Browser-side code
│   ├── server/          # Node.js server code
│   └── common/          # Shared game logic
├── dist/                # Client build output (static files)
├── dist-server/         # Server build output
└── package.json
```

## Updates from Original

This fork includes modernizations by irensaltali:
- Updated all dependencies to modern versions
- Migrated from deprecated packages (node-sass → sass, event-emitter → eventemitter3)
- Added Node.js polyfills for Webpack 5 compatibility
- Removed external dependencies (TypeKit fonts)
- Disabled telemetry/metrics to external servers
- Fixed Socket.IO version compatibility

## License

Apache-2.0

## Authors

See [AUTHORS](AUTHORS) file for details.
