<template>
  <div class="node-property">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item label="节点名称">
        <el-input v-model="form.nodeName"></el-input>
      </el-form-item>
      <el-form-item label="节点ID">
        <el-input v-model="form.nodeId"></el-input>
      </el-form-item>
      <el-form-item label="节点描述">
        <el-input type="textarea" v-model="form.nodeDesc"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import listener from '@/utils/listener'

export default {
  name: 'NodeProperty',
  props: {
    bpmnModeler: {
      type: Object,
      required: true
    }
  },
  model: {
    prop: 'bpmnModeler',
    event: 'updateBpmnModeler'
  },
  data () {
    return {
      customBpmnModeler: this.bpmnModeler,
      shape: null,
      form: {
        nodeName: '',
        nodeId: '',
        nodeDesc: ''
      }
    }
  },
  watch: {
    bpmnModeler: {
      handler (nv) {
        this.customBpmnModeler = nv
      },
      deep: true
    },
    customBpmnModeler: {
      handler (nv) {
        this.$emit('updateBpmnModeler', nv)
      },
      deep: true
    },
    form: {
      handler (nv) {
        console.log('form --------------')
        console.log(nv)
        this.updatePropertiesToModeler()
      },
      deep: true
    }
  },
  mounted () {
    this.initListener()
  },
  methods: {
    initListener () {
      listener.addModelerListener(this.customBpmnModeler, (eventType, shape) => {
        console.log('新建了' + eventType)
      })
      listener.addEventBusListener(this.customBpmnModeler, (eventType, shape) => {
        const { id, name, documentation } = shape.businessObject
        this.shape = shape
        this.form.nodeId = id
        this.form.nodeName = name
        this.form.nodeDesc = documentation.length ? documentation[0].text : ''
      })
    },
    updatePropertiesToModeler () {
      const modeling = this.customBpmnModeler.get('modeling')
      const moddle = this.customBpmnModeler.get('moddle')
      const newDoc = moddle.create('bpmn:Documentation', {
        text: this.form.nodeDesc
      })
      modeling.updateProperties(this.shape, {
        id: this.form.nodeId,
        name: this.form.nodeName,
        documentation: [newDoc]
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.node-property
  padding 10px 20px
  background #cccccc
</style>
