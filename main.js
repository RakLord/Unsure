
import { D } from './numbers.js'
import { load, save } from './save.js'
import { newPlayer } from './state.js'
import { tick } from './sim.js'
import { LAYERS } from './defs.js'

let player = load() ?? newPlayer(LAYERS)

function hardReset() {
  player = newPlayer(LAYERS)
  save(player)
  window.player = player
  setActiveLayer(player.ui.activeLayerId)
}

function tickOnce() {
  tick(player, LAYERS)
}

function setActiveLayer(layerId) {
  if (!LAYERS.some(layer => layer.id === layerId)) return

  player.ui.activeLayerId = layerId

  const containers = document.querySelectorAll('[data-layer-id]')
  containers.forEach(el => {
    const isActive = el.getAttribute('data-layer-id') === layerId
    el.classList.toggle('active-layer', isActive)
    el.style.display = isActive ? '' : 'none'
  })
}

window.player = player
window.D = D
window.game = { save: () => save(player), hardReset, tickOnce, setActiveLayer }
