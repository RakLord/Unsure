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

/**
 * Ensures a loaded player save has all of the required structure for the
 * current layer definitions. Missing fields are filled from a fresh player.
 */
export function reconcilePlayer(savedPlayer, layerDefs) {
  if (!savedPlayer) return newPlayer(layerDefs)

  const base = newPlayer(layerDefs)

  const player = {
    ...base,
    ...savedPlayer,
    meta: { ...base.meta, ...savedPlayer.meta },
    ui: { ...base.ui, ...savedPlayer.ui },
    layers: {},
  }

  for (const layer of layerDefs) {
    const baseLayer = base.layers[layer.id]
    const savedLayer = savedPlayer.layers?.[layer.id] ?? {}

    const mergedLayer = {
      ...baseLayer,
      ...savedLayer,
      currencies: { ...baseLayer.currencies, ...savedLayer.currencies },
      providers: {},
      upgrades: { ...baseLayer.upgrades, ...savedLayer.upgrades },
    }

    for (const provider of layer.providers) {
      mergedLayer.providers[provider.id] = {
        ...baseLayer.providers[provider.id],
        ...savedLayer.providers?.[provider.id],
      }
    }

    player.layers[layer.id] = mergedLayer
  }

  return player
}
