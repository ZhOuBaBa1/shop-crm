<template>
  <el-card>
    <div class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value" size="small">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div ref="charts" class="charts"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      value: '全部渠道',
      shopList: [],
      onlineList: []
    }
  },
  computed: {
    ...mapState({ list: (state) => state.home.list }),
    ...mapGetters(['nameList', 'valueList1', 'valueList2'])
  },
  watch: {},
  mounted() {
    let myCharts = echarts.init(this.$refs.charts)
    myCharts.setOption({
      title: {
        text: '家用电器',
        subtext: '312',
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '类别',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outsize'
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 312, name: '家用电器' },
            { value: 336, name: '食用酒水' },
            { value: 342, name: '个护健康' },
            { value: 97, name: '服饰箱包' },
            { value: 181, name: '母婴产品' },
            { value: 94, name: '其他' }
          ]
        }
      ]
    })
    myCharts.on('mouseover', (params) => {
      const { name, value } = params.data
      myCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  },
  methods: {}
}
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header {
  border-bottom: 1px solid #eee;
}
.charts {
  widows: 100%;
  height: 285px;
}
</style>
