import {
  assign,
  forEach,
  isArray
} from 'min-dash'
import {
  hasPrimaryModifier
} from 'diagram-js/lib/util/Mouse'
import { isAny } from '@/utils/util'

export default function ContextPadProvider(contextPad, config, injector, translate, bpmnFactory, elementFactory, create, modeling, connect, rules) {
  this.create = create
  this.elementFactory = elementFactory
  this.translate = translate
  this.bpmnFactory = bpmnFactory
  this.modeling = modeling
  this.connect = connect
  this.rules = rules
  config = config || {}
  if (config.autoPlace !== false) {
    this.autoPlace = injector.get('autoPlace', false)
  }
  contextPad.registerProvider(this)
}

ContextPadProvider.$inject = [
  'contextPad',
  'config',
  'injector',
  'translate',
  'bpmnFactory',
  'elementFactory',
  'create',
  'modeling',
  'connect',
  'rules'
]

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  const {
    autoPlace,
    create,
    elementFactory,
    translate,
    modeling,
    rules,
    connect
  } = this

  var actions = {}

  if (element.type === 'label') {
    return actions
  }

  var businessObject = element.businessObject

  function startConnect(event, element) {
    connect.start(event, element)
  }

  function removeElement(e) {
    modeling.removeElements([element])
  }

  if (isAny(businessObject, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference'])) {
    assign(actions, {
      connect: {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Connect using DataInputAssociation'),
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }
    })
  }

  // delete element entry, only show if allowed by rules
  var deleteAllowed = rules.allowed('elements.delete', { elements: [element] })

  if (isArray(deleteAllowed)) {
    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === element
  }

  if (deleteAllowed) {
    assign(actions, {
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      }
    })
  }

  assign(actions, {
    connect: {
      group: 'edit',
      className: 'bpmn-icon-connection-multi',
      title: translate('Connect using Association'),
      action: {
        click: startConnect,
        dragstart: startConnect
      }
    }
  })

  return actions
}

// helpers /////////

function isEventType(eventBo, type, definition) {
  var isType = eventBo.$instanceOf(type)
  var isDefinition = false

  var definitions = eventBo.eventDefinitions || []
  forEach(definitions, function (def) {
    if (def.$type === definition) {
      isDefinition = true
    }
  })

  return isType && isDefinition
}
