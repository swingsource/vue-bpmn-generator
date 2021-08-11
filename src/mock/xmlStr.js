export var xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="5.1.2">
  <process id="Process_1" isExecutable="false">
    <documentation></documentation>
    <startEvent id="StartEvent_1y45yut" name="开始">
      <outgoing>SequenceFlow_0h21x7r</outgoing>
    </startEvent>
    <task id="Task_1hcentk" name="小明">
      <documentation></documentation>
      <incoming>SequenceFlow_0h21x7r</incoming>
      <outgoing>Flow_1j7buk7</outgoing>
    </task>
    <sequenceFlow id="SequenceFlow_0h21x7r" sourceRef="StartEvent_1y45yut" targetRef="Task_1hcentk" />
    <exclusiveGateway id="Gateway_0xlkbp8">
      <documentation></documentation>
      <incoming>Flow_1j7buk7</incoming>
      <outgoing>Flow_1m821jy</outgoing>
    </exclusiveGateway>
    <sequenceFlow id="Flow_1j7buk7" sourceRef="Task_1hcentk" targetRef="Gateway_0xlkbp8" />
    <userTask id="Activity_1gtcml4" name="大明">
      <documentation></documentation>
      <incoming>Flow_1m821jy</incoming>
    </userTask>
    <sequenceFlow id="Flow_1m821jy" name="报销金额大于等于10" sourceRef="Gateway_0xlkbp8" targetRef="Activity_1gtcml4">
      <documentation></documentation>
      <conditionExpression xsi:type="tFormalExpression">#{budgetAmount&gt;=10}</conditionExpression>
    </sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="SequenceFlow_0h21x7r_di" bpmnElement="SequenceFlow_0h21x7r">
        <omgdi:waypoint x="188" y="120" />
        <omgdi:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1j7buk7_di" bpmnElement="Flow_1j7buk7">
        <omgdi:waypoint x="340" y="120" />
        <omgdi:waypoint x="395" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1m821jy_di" bpmnElement="Flow_1m821jy">
        <omgdi:waypoint x="420" y="145" />
        <omgdi:waypoint x="420" y="290" />
        <omgdi:waypoint x="520" y="290" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="397" y="215" width="88" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
        <omgdc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="160" y="145" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1hcentk_di" bpmnElement="Task_1hcentk">
        <omgdc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0xlkbp8_di" bpmnElement="Gateway_0xlkbp8" isMarkerVisible="true">
        <omgdc:Bounds x="395" y="95" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1gtcml4_di" bpmnElement="Activity_1gtcml4">
        <omgdc:Bounds x="520" y="250" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`
