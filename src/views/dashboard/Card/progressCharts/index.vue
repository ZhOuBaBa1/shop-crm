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
        //最小值与最大值
        min: 0,
        max: 100
      },
      yAxis: { show: false, type: 'category' },
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            colo: '#eee'
          },
          //文本
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }
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
