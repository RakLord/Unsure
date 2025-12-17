# Codebase Review

## Overview
This project appears to be an incremental/idle game prototype built with Vite and Break Infinity for large-number math. Core files define layer metadata, player state initialization, simulation ticks, persistence helpers, and a simple HTML shell.

## Structure and Behavior
- `defs.js` declares a single example layer (`L1`) with currencies, a provider, and several upgrades; later layers are implied but not yet defined.【F:defs.js†L1-L18】
- `state.js` constructs a new player object from the layer definitions, initializing currencies with `Decimal.ZERO`, provider timers, and upgrade levels while tracking meta and UI state (active layer).【F:state.js†L1-L27】
- `sim.js` advances provider timers: it computes cycles based on provider period, applies reward/speed/crit modifiers, and adds earnings to the appropriate currency while updating `lastTickAt`. Crit rolls are simulated per cycle for small batches and approximated for large ones.【F:sim.js†L1-L55】
- `save.js` serializes/deserializes the player object to `localStorage`, encoding `Decimal` instances with a tag so they can be restored correctly on load.【F:save.js†L1-L29】
- `numbers.js` re-exports `Decimal` from `break_infinity.js`, provides a helper `D` constructor, and a simple formatter.【F:numbers.js†L1-L13】
- `index.html` is a barebones page that mounts `main.js` and shows a placeholder container with a dollar icon.【F:index.html†L1-L13】

## Notable Issues
- `main.js` is incomplete: it references `hardReset`, `tickOnce`, and `setActiveLayer` without importing or defining them, and it assigns `window.player` and `window.game` twice with conflicting shapes. This will throw reference errors once the module executes.【F:main.js†L2-L14】
- The project lacks any UI logic beyond the placeholder HTML and has no wiring to the simulation or persistence helpers, suggesting many features are still unimplemented.

## Recommendations
- Flesh out `main.js` to import or implement the missing functions (`hardReset`, `tickOnce`, `setActiveLayer`) and avoid duplicate global assignments.
- Add UI components to display currencies, providers, and upgrades, invoking `tick` from `sim.js` on an interval and exposing save/reset hooks via buttons instead of globals.
- Expand `defs.js` with additional layers and upgrade effects, and connect `computeLayerMods` to those upgrade states.
- Add basic tests or a development checklist so regressions in persistence and simulation can be caught early.
