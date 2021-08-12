function getShape (bpmnModeler, id) {
  var elementRegistry = bpmnModeler.get('elementRegistry')
  return elementRegistry.get(id)
}

function isInvalid (param) { // 判断是否是无效的值
  return param === null || param === undefined || param === ''
}
function isSequenceFlow (type) { // 判断是否是线
  return type === 'bpmn:SequenceFlow'
}

function elementChanged (bpmnModeler, eventType, e) {
  const shape = getShape(bpmnModeler, e.element.id)
  console.log('>>>>>>>>>>>>>>1234567')
  console.log(shape)
  if (!shape) {
    // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
    console.log('无效的shape')
    // 上面已经用 shape.removed 检测了shape的删除, 要是删除shape的话这里还会被再触发一次
    console.log('删除了shape和connect')
    return
  }
  if (isInvalid(shape.type)) {
    if (isSequenceFlow(shape.type)) {
      console.log('改变了线')
    }
  }
}

export default {
  // 监听modeler
  addModelerListener (bpmnModeler, callback) {
    const events = ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move']
    events.forEach(function (eventType) {
      bpmnModeler.on(eventType, e => {
        const elementRegistry = bpmnModeler.get('elementRegistry')
        if (!e) {
          return
        }
        try {
          const shape = e.element ? elementRegistry.get(e.element.id) : e.shape
          callback(eventType, shape)
        } catch (e) {
          // throw new Error('Can not get shape!')
        }
      })
    })
  },
  // 监听element
  addEventBusListener (bpmnModeler, callback) {
    const eventBus = bpmnModeler.get('eventBus')
    const modeling = bpmnModeler.get('modeling')
    const elementRegistry = bpmnModeler.get('elementRegistry')
    const eventTypes = ['element.click', 'element.changed']

    eventTypes.forEach(function (eventType) {
      eventBus.on(eventType, function (e) {
        if (!e) {
          return
        }
        try {
          const shape = e.element ? elementRegistry.get(e.element.id) : e.shape
          callback(eventType, shape)
        } catch (e) {
          // throw new Error('Can not get shape!')
        }

        // if (!e || e.element.type === 'bpmn:Process') return
        // if (eventType === 'element.changed') {
        //   elementChanged(bpmnModeler, eventType, e)
        // } else if (eventType === 'element.click') {
        //   console.log('点击了element')
        //   const shape = e.element ? elementRegistry.get(e.element.id) : e.shape
        //   callback(eventType, shape)
        //   if (shape.type === 'bpmn:StartEvent') {
        //     modeling.updateProperties(shape, {
        //       name: '我是修改后的虚线节点',
        //       isInterrupting: false,
        //       customText: '我是自定义的text属性'
        //     })
        //     modeling.setColor(shape, {
        //       fill: '#ff0000',
        //       stroke: null
        //     })
        //   }
        // }
      })
    })
  }

}
