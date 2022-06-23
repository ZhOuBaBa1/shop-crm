<template>
  <div>
    <el-table style="width: 100%; margin: 20px 0px" border :data="records">
      <el-table-column
        type="index"
        align="center"
        prop="prop"
        label="序号"
        width="80px"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="width"
      ></el-table-column>
      <el-table-column prop="description" label="默认图片">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量（KG）"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isSale == 1"
            type="success"
            icon="el-icon-bottom"
            size="mini"
            title="下架"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            v-else
            type="success"
            icon="el-icon-top"
            size="mini"
            title="上架"
            @click="onSale(row)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            title="查看详情"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除“${row.spuName}”吗？`"
            @onConfirm="deleteSpu(row)"
          >
            <el-button
              slot="reference"
              style="margin: 10px"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              title="删除spu"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer :visible.sync="drawer" :show-close="false" size="35%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              type="success"
              style="margin-right: 10px"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

    <!-- 分页器  -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10, 20, 50]"
      :page-size="limit"
      :page-count="7"
      layout="prev,pager,next,jumper,-> ,sizes,total"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      records: [],
      skuInfo: {},
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages
      let result = await this.$API.sku.reqSkuList(this.page, this.limit)
      if (result.code == 200) {
        this.limit = result.data.size
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    async onSale(row) {
      let result = await this.$API.sku.reqSale(row.id)
      if (result.code == 200) {
        row.isSale = 1
        this.$message({
          type: 'success',
          message: '上架成功'
        })
      } else {
        this.$message({
          type: 'danger',
          message: '上架失败'
        })
      }
    },
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancel(row.id)
      console.log(result)
      if (result.code == 200) {
        row.isSale = 0
        this.$message({
          type: 'success',
          message: '下架成功'
        })
      } else {
        this.$message({
          type: 'danger',
          message: '下架失败'
        })
      }
    },
    edit() {
      this.$message('正在开发中...')
    },
    async getSkuInfo(sku) {
      this.drawer = true
      let result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code == 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
</style>
