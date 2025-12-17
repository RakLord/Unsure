class ProviderTemplate {
  constructor(definition) {
    this.definition = definition
  }

  /**
   * @param {object} state
   * @param {object} context
   * @returns {{ element: HTMLElement, update: (state: object) => void }}
   */
  createView(state, context = {}) {
    throw new Error('createView must be implemented by a template variant')
  }
}

class BasicProviderTemplate extends ProviderTemplate {
  createView(state, context = {}) {
    const root = document.createElement('article')
    root.className = 'provider-card'
    root.dataset.providerId = this.definition.id

    const header = document.createElement('header')
    const title = document.createElement('h3')
    title.textContent = this.definition.name
    header.append(title)

    const details = document.createElement('div')
    details.className = 'provider-details'

    const level = document.createElement('p')
    const reward = document.createElement('p')
    const status = document.createElement('p')
    const toggle = document.createElement('button')

    details.append(level, reward, status)

    toggle.addEventListener('click', () => {
      context.onToggle?.()
    })

    root.append(header, details, toggle)

    const update = newState => {
      const running = !!newState.running
      level.textContent = `Level: ${newState.level}`
      reward.textContent = `Base reward: ${this.definition.baseReward} ${this.definition.currency}`
      status.textContent = running ? 'Running' : 'Paused'
      toggle.textContent = running ? 'Pause' : 'Start'
    }

    update(state)

    return { element: root, update }
  }
}

export function resolveProviderTemplate(definition) {
  return new BasicProviderTemplate(definition)
}

export { ProviderTemplate, BasicProviderTemplate }
