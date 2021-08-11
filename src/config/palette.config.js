const paletteNodeList = [
  ['create.start-event', {
    title: '开始',
    type: 'bpmn:StartEvent',
    group: 'event',
    className: 'bpmn-icon-start-event-none'
  }],
  ['create.exclusive-gateway', {
    title: '网关',
    type: 'bpmn:ExclusiveGateway',
    group: 'gateway',
    className: 'bpmn-icon-gateway-none'
  }],
  ['create.user-task', {
    title: '用户任务',
    type: 'bpmn:UserTask',
    group: 'activity',
    className: 'bpmn-icon-user-task'
  }],
  ['create.end-event', {
    title: '结束',
    type: 'bpmn:EndEvent',
    group: 'event',
    className: 'bpmn-icon-end-event-none'
  }]
]

export const paletteNodeMap = new Map(paletteNodeList)
