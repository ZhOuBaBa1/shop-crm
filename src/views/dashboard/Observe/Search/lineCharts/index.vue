<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <svg
        t="1655697427041"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2134"
        width="25"
        height="25"
      >
        <path
          d="M512 179.2a332.8 332.8 0 1 1 0 665.6 332.8 332.8 0 0 1 0-665.6z m0 51.2a281.6 281.6 0 1 0 0 563.2 281.6 281.6 0 0 0 0-563.2z"
          p-id="2135"
          fill="#cdcdcd"
        ></path>
        <path
          d="M512.768 339.968a38.7072 38.7072 0 1 1 0 77.3632 38.7072 38.7072 0 0 1 0-77.3632zM546.4576 678.6048h-27.2384c-14.2848 0-29.0304-12.3904-29.0304-23.7056V498.0224h-9.728a25.8048 25.8048 0 1 1 0-51.6096s31.488-0.1024 32.3072 0c13.1072 0.9728 22.5792 6.656 22.5792 17.3568v163.2768h11.1104a25.8048 25.8048 0 1 1 0 51.5584z"
          p-id="2136"
          fill="#cdcdcd"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <svg
        t="1655699189954"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3236"
        width="16"
        height="16"
      >
        <path
          d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
          fill="#d81e06"
          p-id="3237"
        ></path>
      </svg>
      <svg
        t="1655699230156"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4342"
        width="16"
        height="16"
      >
        <path
          d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z"
          fill="#1afa29"
          p-id="4343"
        ></path>
      </svg>
    </div>
    <div class="footer">
      <div ref="charts" class="charts"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: { show: false },
      series: [
        {
          type: 'line',
          data: [66, 7, 44, 12, 88, 8, 36, 15, 66, 40],
          //设置拐点的样式
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: 'yellowgreen'
          },
          areaStyle: {
            // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'yellowgreen' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
            // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
          }
        }
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.search-header {
  margin-right: 10px;
}
.main {
  margin: 10px 0px;
}
.main-title {
  margin-right: 30px;
}
.main-content {
  margin-right: 10px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>
