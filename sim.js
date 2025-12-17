import Decimal from 'break_infinity.js'

// keep time as Number; keep multipliers as Number for speed
function computeLayerMods(player, layerDef) {
  // minimal defaults; expand later with upgrades
  return {
    speedMul: 1,
    rewardMul: 1,
    critChance: 0,
    critMult: 2,
  }
}

export function tick(player, layerDefs) {
  const now = Date.now()

  for (const layerDef of layerDefs) {
    const layerState = player.layers[layerDef.id]
    if (!layerState?.unlocked) continue

    const mods = computeLayerMods(player, layerDef)

    for (const pDef of layerDef.providers) {
      const pState = layerState.providers[pDef.id]
      if (!pState?.unlocked || !pState.running) continue

      const period = Math.max(50, Math.floor(pDef.basePeriodMs / mods.speedMul))
      if (now < pState.nextCompleteAt) continue

      const cycles = Math.floor((now - pState.nextCompleteAt) / period) + 1

      const base = new Decimal(pDef.baseReward).mul(mods.rewardMul)

      // expected-value for large cycles, per-roll for small cycles
      let total
      if (cycles <= 200) {
        total = Decimal.ZERO
        for (let i = 0; i < cycles; i++) {
          const isCrit = Math.random() < mods.critChance
          total = total.add(isCrit ? base.mul(mods.critMult) : base)
        }
      } else {
        const expectedMult = 1 + mods.critChance * (mods.critMult - 1)
        total = base.mul(expectedMult).mul(cycles)
      }

      layerState.currencies[pDef.currency] =
        layerState.currencies[pDef.currency].add(total)

      pState.nextCompleteAt += cycles * period
    }
  }

  player.meta.lastTickAt = now
}
