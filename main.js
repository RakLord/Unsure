
import { D } from './numbers.js'
import { load, save } from './save.js'
import { newPlayer, reconcilePlayer } from './state.js'
import { tick } from './sim.js'
import { LAYERS } from './defs.js'
import { resolveProviderTemplate } from './ui/providers.js'

let player = reconcilePlayer(load(), LAYERS)

const layerBindings = new Map()
const layerNavButtons = new Map()

const layerBindings = new Map()
const layerNavButtons = new Map()

function hardReset() {
  player = newPlayer(LAYERS)
  save(player)
  window.player = player
  setActiveLayer(player.ui.activeLayerId)
}

function tickOnce() {
  tick(player, LAYERS)
  updateUI()
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

  layerNavButtons.forEach((btn, id) => {
    btn.disabled = id === layerId
    btn.classList.toggle('active', id === layerId)
  })
}

function toggleProvider(layerId, providerId) {
  const layer = player.layers[layerId]
  if (!layer) return

  const provider = layer.providers[providerId]
  if (!provider) return

  provider.running = !provider.running
  updateUI()
}

function createLayerSection(layerDef) {
  const layerState = player.layers[layerDef.id]
  const section = document.createElement('section')
  section.dataset.layerId = layerDef.id

  const title = document.createElement('h2')
  title.textContent = layerDef.name

  const currencyList = document.createElement('div')
  currencyList.className = 'currency-list'
  const currencyBindings = {}

  for (const currency of layerDef.currencies) {
    const row = document.createElement('p')
    const label = document.createElement('span')
    const value = document.createElement('strong')

    label.textContent = `${currency.toUpperCase()}: `
    value.textContent = '0'

    row.append(label, value)
    currencyList.append(row)
    currencyBindings[currency] = value
  }

  const providersContainer = document.createElement('div')
  providersContainer.className = 'provider-list'
  const providerBindings = {}

  for (const pDef of layerDef.providers) {
    const template = resolveProviderTemplate(pDef)
    const { element, update } = template.createView(layerState.providers[pDef.id], {
      onToggle: () => toggleProvider(layerDef.id, pDef.id),
    })

    providerBindings[pDef.id] = update
    providersContainer.append(element)
  }

  section.append(title, currencyList, providersContainer)

  const update = layer => {
    Object.entries(layer.currencies).forEach(([currency, value]) => {
      if (currencyBindings[currency]) {
        const safeValue = value ?? D(0)
        currencyBindings[currency].textContent = safeValue.toString()
        currencyBindings[currency].textContent = value.toString()
      }
    })

    Object.entries(layer.providers).forEach(([id, providerState]) => {
      providerBindings[id]?.(providerState)
    })
  }

  return { section, update }
}

function renderGame() {
  const nav = document.getElementById('layer-nav')
  const container = document.getElementById('layers-container')

  LAYERS.forEach(layer => {
    const navButton = document.createElement('button')
    navButton.textContent = layer.name
    navButton.type = 'button'
    navButton.addEventListener('click', () => setActiveLayer(layer.id))

    layerNavButtons.set(layer.id, navButton)
    nav.append(navButton)

    const { section, update } = createLayerSection(layer)
    layerBindings.set(layer.id, update)
    container.append(section)
  })

  updateUI()
  setActiveLayer(player.ui.activeLayerId)
}

function updateUI() {
  LAYERS.forEach(layer => {
    const update = layerBindings.get(layer.id)
    if (update) update(player.layers[layer.id])
  })
}

window.player = player
window.D = D
window.game = { save: () => save(player), hardReset, tickOnce, setActiveLayer }

renderGame()
setInterval(() => {
  tick(player, LAYERS)
  updateUI()
}, 200)
