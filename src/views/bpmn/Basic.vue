<template>
  <div class="containers">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
    <div id="custom-proterties-panel" class="custom-panel">
      <node-property v-model="bpmnModeler" v-if="nodePropertyVisible"></node-property>
      <condition-property v-model="bpmnModeler" v-if="conditionPropertyVisible"></condition-property>
      <div slot="custom-property"></div>
    </div>
    <ul class="buttons">
      <li>
        <a ref="saveBpmnToRemote" title="保存" @click="handleClickSave">保存</a>
      </li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="保存为bpmn"
          >保存为bpmn</a
        >
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="保存为svg">保存为svg</a>
      </li>
      <li>
        <a href="javascript:void(0);" @click="handleClickSetColor">设置颜色</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { xmlStr } from '@/mock/xmlStr'

// 引入bpmn
import BpmnModeler from 'bpmn-js/lib/Modeler'
// import CustomBpmnModeler from '@/custom/model'
// 引入bpmn左侧工具栏
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// 右边工具栏样式
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

// 监听器
import listener from '@/utils/listener'

// 自定义palette
import customPaletteProvider from '@/custom/paletteProvider'
import customPalette from '@/custom/palette'

import customContextPadProvider from '@/custom/contextPadProvider'
import customContextPad from '@/custom/contextPad'

// 汉化
import customTranslate from '@/utils/customTranslate'

import NodeProperty from '@/views/bpmn/NodeProperty'
import ConditionProperty from '@/views/bpmn/ConditionProperty'

import { getShapeType } from '@/utils/util'

const customTranslateModule = {
  translate: ['value', customTranslate]
}

export default {
  data () {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      newXml: '',
      currentShape: null
    }
  },
  components: {
    NodeProperty,
    ConditionProperty
  },
  computed: {
    nodePropertyVisible () {
      return this.bpmnModeler
    },
    conditionPropertyVisible () {
      return this.bpmnModeler && this.judgeCurrentShapeType(this.currentShape) === 'bpmn:SequenceFlow'
    }
  },
  mounted () {
    this.initBpmn()
    console.log(this.bpmnModeler)
    // this.testAxios()
  },
  methods: {
    async initBpmn () {
      // 获取到属性ref为 canvas 的dom节点
      const canvas = this.$refs.canvas

      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        // 添加属性面板
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 右边的属性栏
          propertiesProviderModule,
          propertiesPanelModule,
          // 汉化
          customTranslateModule,
          customPaletteProvider,
          customPalette,
          customContextPadProvider,
          customContextPad
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })

      const xmlStr = await this.getBpmnXml()
      this.transformXmlToCanvas(xmlStr)
      // this.bpmnModeler.createDiagram()
      // this.bpmnModeler.clear()
    },
    // 获取xml
    async getBpmnXml () {
      const defaultXml = xmlStr
      // const res = await axios.get("http://10.0.68.58:8080/workflow/deployment");
      // console.log(res);
      return defaultXml
      return res.data.data
    },
    // 将字符串转换成图显示出来
    transformXmlToCanvas (xmlStr) {
      this.bpmnModeler.importXML(xmlStr, err => {
        if (err) {
          console.error(err)
        } else {
          // 这里是成功之后的回调, 可以在这里做一系列事情
          this.success()
        }
        // 让图能自适应屏幕
        var canvas = this.bpmnModeler.get('canvas')
        canvas.zoom('fit-viewport')
      })
    },
    success () {
      console.log('创建成功!')
      this.addBpmnListener()
      listener.addModelerListener(this.bpmnModeler)
      listener.addEventBusListener(this.bpmnModeler, (eventType, shape) => {
        this.currentShape = shape
      })
    },
    // 添加绑定事件
    addBpmnListener () {
      const that = this
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram
      const downloadSvgLink = this.$refs.saveSvg
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', async function () {
        const { svg } = await that.bpmnModeler.saveSVG()
        that.setEncoded(downloadSvgLink, 'diagram.svg', svg)

        const { xml } = await that.bpmnModeler.saveXML({ format: true })
        that.setEncoded(downloadLink, 'diagram.bpmn', xml)

        that.newXml = xml
      })
    },
    setEncoded (link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)

      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
    },
    handleClickSave () {
      console.log(this.newXml)
    },
    handleClickSetColor () {
      const modeling = this.bpmnModeler.get('modeling')
      modeling.setColor([this.currentShape], {
        stroke: 'green',
        fill: 'yellow'
      })
    },
    judgeCurrentShapeType (shape) {
      if (shape) {
        return getShapeType(shape)
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.containers{
	position: absolute;
	background-color: #ffffff;
	width: 100%;
	height: 100%;
}
.canvas{
	width: 100%;
	height: 100%;
}
.panel{
	position: absolute;
	right: 0;
	top: 0;
	width: 300px;
}
.custom-panel{
  position absolute
  top 0
  bottom 0
  right 340px
  width 320px
  overflow-y auto
  background #ffffff
}
.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
}
.buttons li {
  display: inline-block;
  margin: 5px;
}
.buttons li a {
  color: #999;
  background: #eee;
  // cursor: not-allowed;
  padding: 8px;
  border: 1px solid #ccc;
  text-decoration: none;
}
.buttons li a.active {
  color: #333;
  background: #fff;
  cursor: pointer;
}
</style>
