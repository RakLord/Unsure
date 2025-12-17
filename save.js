// save.js
import Decimal from 'break_infinity.js'

const KEY = 'unsure_save_v1'
const TAG = '__d'

export function save(player) {
  player.meta.lastSaveAt = Date.now()
  localStorage.setItem(KEY, stringifyPlayer(player))
}

export function load() {
  const raw = localStorage.getItem(KEY)
  return raw ? parsePlayer(raw) : null
}

function stringifyPlayer(player) {
  return JSON.stringify(player, (_, v) => {
    if (v instanceof Decimal) return { [TAG]: v.toString() }
    return v
  })
}

function parsePlayer(json) {
  return JSON.parse(json, (_, v) => {
    if (v && typeof v === 'object' && TAG in v) return new Decimal(v[TAG])
    return v
  })
}
