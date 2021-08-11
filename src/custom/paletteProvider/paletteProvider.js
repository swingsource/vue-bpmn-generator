/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default function PaletteProvider(palette, create, elementFactory, globalConnect) {
  this.create = create
  this.elementFactory = elementFactory
  this.globalConnect = globalConnect

  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'globalConnect'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  return {
  }
}
