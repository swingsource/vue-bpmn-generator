import { paletteNodeMap } from '@/config/palette.config'

export default class CustomPalette {
  constructor(create, elementFactory, palette, translate) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate

    palette.registerProvider(this)
  }

  getPaletteEntries(element) {
    const {
      create,
      elementFactory,
      translate
    } = this

    function createElement(event) {
      const shape = elementFactory.createShape({ type: paletteNodeMap.get(event.delegateTarget.dataset.action).type })
      create.start(event, shape)
    }

    const nodeEntry = {}

    for (const key of paletteNodeMap) {
      const temp = {}
      temp.group = key[1].group
      temp.className = key[1].className
      temp.title = translate(key[1].title)
      temp.action = {
        dragstart: createElement,
        click: createElement
      }
      nodeEntry[key[0]] = temp
    }

    return nodeEntry
  }
}

CustomPalette.$inject = [
  'create',
  'elementFactory',
  'palette',
  'translate'
]
