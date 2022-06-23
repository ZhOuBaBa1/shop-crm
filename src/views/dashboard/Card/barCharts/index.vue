<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  //初始化组件实例
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        //均分
        type: 'category'
      },
      yAxis: { show: false },
      series: [
        {
          type: 'bar',
          data: [66, 7, 44, 12, 88, 8, 36, 15, 66, 40, 21, 30],
          color: 'cyan'
        }
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
