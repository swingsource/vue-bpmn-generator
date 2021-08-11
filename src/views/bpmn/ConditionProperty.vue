<template>
  <div class="condition-property">
    <div class="condition-title">设置条件</div>
    <el-form ref="form" :model="form" size="small">
      <el-row>
        <el-col :span="24" class="the-hole-row">
          <el-form-item>
            <el-select v-model="form.condition" placeholder="请选择条件">
              <el-option v-for="(item, index) of conditionList"
                         :key="index"
                         :label="item.label"
                         :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
       <el-col :span="8">
         <el-form-item>
           <el-select v-model="form.operator" placeholder="请选择">
             <el-option v-for="(item, index) of operatorList"
                        :key="index"
                        :label="item.label"
                        :value="item.key">
             </el-option>
           </el-select>
         </el-form-item>
       </el-col>
        <el-col :span="14" :offset="2">
          <el-input v-model="form.value" size="small"></el-input>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { conditionList, operatorList } from '@/config/property.config'
import listener from '@/utils/listener'

export default {
  name: 'ConditionProperty',
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
        condition: '',
        operator: '',
        value: ''
      },
      conditionList,
      operatorList
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
      listener.addEventBusListener(this.customBpmnModeler, (eventType, shape) => {
        this.shape = shape
        const conditionExpression = shape.businessObject && shape.businessObject.conditionExpression && shape.businessObject.conditionExpression.body
        console.log('-------------conditionExpression-----------------')
        console.log(shape.businessObject.name)
        console.log(shape.businessObject.conditionExpression)
        console.log(shape.businessObject.conditionExpression.body)
        console.log(conditionExpression)
        console.log('----------------------end------------------------')
        if (conditionExpression && conditionExpression.startsWith('#') && conditionExpression.endsWith('}')) {
          let expression = conditionExpression.slice(2)
          expression = expression.slice(0, expression.length - 1)
          if (expression.indexOf('>=') > -1) {
            this.transformExpressionToDesc(expression, '>=')
          } else if (expression.indexOf('<=') > -1) {
            this.transformExpressionToDesc(expression, '<=')
          } else if (expression.indexOf('>') > -1) {
            this.transformExpressionToDesc(expression, '>')
          } else if (expression.indexOf('<') > -1) {
            this.transformExpressionToDesc(expression, '<')
          }
        }
      })
    },
    updatePropertiesToModeler () {
      const modeling = this.customBpmnModeler.get('modeling')
      const moddle = this.customBpmnModeler.get('moddle')
      const newCondition = moddle.create('bpmn:FormalExpression', {
        body: this.transformDescToExpression()
      })
      console.log('---------------updatePropertiesToModeler----------------------')
      console.log(newCondition)
      modeling.updateProperties(this.shape, {
        conditionExpression: newCondition
      })
    },
    transformDescToExpression () {
      const { condition, operator, value } = this.form
      return '#{' + `${condition}${operator}${value}` + '}'
    },
    transformExpressionToDesc (exp, operator) {
      const expList = exp.split(operator)
      const [condition, value] = expList
      console.log('转换之后的表达式')
      console.log(condition, operator, value)
      this.form.condition = condition
      this.form.operator = operator
      this.form.value = value
    }
  }
}
</script>

<style scoped lang="stylus">
.condition-property
  margin-top 20px
  padding 10px 20px
  background #cccccc
  .the-hole-row >>> .el-select
    width 100%
</style>
