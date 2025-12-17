// state.js
import { Decimal } from './numbers.js'

export function newPlayer(layerDefs) {
  const now = Date.now()
  const layers = {}

  for (const layer of layerDefs) {
    layers[layer.id] = {
      unlocked: layer.id === layerDefs[0].id,
      currencies: Object.fromEntries(layer.currencies.map(c => [c, Decimal.ZERO])),
      providers: Object.fromEntries(layer.providers.map(p => [p.id, {
        unlocked: p.unlockedByDefault ?? true,
        level: 0,
        running: true,
        nextCompleteAt: now + p.basePeriodMs,
      }])),
      upgrades: Object.fromEntries(layer.upgrades.map(u => [u.id, 0])),
    }
  }

  return {
    meta: { version: 1, createdAt: now, lastSaveAt: now, lastTickAt: now },
    ui: { activeLayerId: layerDefs[0].id },
    layers,
  }
}
