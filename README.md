# Session Trick List

Printable cheat sheet for [Session: Skate Sim](https://store.steampowered.com/app/861650/Session_Skate_Sim/) controller inputs.

Open `index.html` in a browser and print to PDF (Cmd+P / Ctrl+P, landscape orientation).

## Pages

| Page | Content |
|------|---------|
| 1 | Basic Flip Tricks — Normal + Nollie |
| 2 | Basic Flip Tricks — Switch + Fakie |
| 3 | Basic Grinds & Slides — Normal + Switch |
| 4 | Basic Pressure Tricks — All four stances |

## Project structure

```
regular.json          # Trick data for Regular stance (left foot forward)
goofy.json            # Trick data for Goofy stance (right foot forward)
build.js              # Zero-dependency Node.js build script
index.html            # Generated from regular.json
index_goofy.html      # Generated from goofy.json
screenshots/          # In-game screenshots used for reference
.github/workflows/    # Auto-rebuilds index.html on push to main
```

## Building locally

```sh
node build.js                         # regular.json → index.html (defaults)
node build.js goofy.json goofy.html   # custom input/output
```

No dependencies — just Node.js 18+.

## How it works

Trick data lives in JSON files (`regular.json`, `goofy.json`). The build script reads a JSON file and generates a self-contained HTML page with embedded CSS. GitHub Actions runs the build on every push to `main` and commits the updated `index.html` if it changed.

GitHub Pages serves `index.html` from the `main` branch root.

## JSON format

Each JSON file has three top-level keys: `flipTricks`, `grinds`, and `pressureTricks`. Flip tricks and pressure tricks are grouped by stance (`normal`, `nollie`, `switch`, `fakie`); grinds are grouped as `normal` and `switch`. Each trick has:

```json
{
  "name": "Kickflip",
  "left": "↓",
  "right": "↗"
}
```

Where `left` and `right` are the joystick inputs for the left and right sticks.

## Notes

- All inputs in `regular.json` are for **Regular** stance (left foot forward)
- Joystick directions use Unicode arrows: `↑ ↓ ← → ↗ ↘ ↙ ↖`
- Rotation inputs: `↻` (clockwise / BS 360) and `↺` (counter-clockwise / FS 360)
- Transcribed from in-game screenshots included in this repo
