import { paletteNodeMap } from '@/config/palette.config'

export default class CustomContextPad {
  constructor(config, contextPad, create, elementFactory, injector, translate) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false)
    }

    contextPad.registerProvider(this)
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      create,
      elementFactory,
      translate
    } = this

    function appendAction(event, element) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: paletteNodeMap.get(`create.${event.delegateTarget.dataset.action.split('.')[1]}`).type })
        autoPlace.append(element, shape)
      } else {
        appendActionStart(event, element)
      }
    }

    function appendActionStart(event) {
      const shape = elementFactory.createShape({ type: paletteNodeMap.get(`create.${event.delegateTarget.dataset.action.split('.')[1]}`).type })
      create.start(event, shape, {
        source: element
      })
    }

    const nodeEntry = {}

    for (const key of paletteNodeMap) {
      const temp = {}
      temp.group = 'model'
      temp.className = key[1].className
      temp.title = translate(key[1].title)
      temp.action = {
        dragstart: appendAction,
        click: appendActionStart
      }
      nodeEntry[`append.${key[0].split('.')[1]}`] = temp
    }

    return nodeEntry
  }
}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
]
