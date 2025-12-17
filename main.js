
import { D } from './numbers.js'
import { load, save } from './save.js'
import { newPlayer } from './state.js'
import { LAYERS } from './defs.js'

let player = load() ?? newPlayer(LAYERS)

window.player = player
window.D = D
window.game = { save: () => save(player) }

window.player = player;
window.game = { save, load, hardReset, tickOnce, setActiveLayer };
