<template>
  <div>
    <el-card style="margin: 20px 0px"
      ><CategorySelect
        :show="scene != 0"
        @getCategoryId="getCategoryId"
      ></CategorySelect
    ></el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- :disabled="!category3Id" -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 10px, 0px"
          :disabled="!category3Id"
          @click="addSpu"
          >添加Spu</el-button
        >
        <el-table style="width: 100%; margin: 20px 0px" border :data="records">
          <el-table-column
            type="index"
            align="center"
            prop="prop"
            label="序号"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handleSkuList(row)"
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

        <!-- 分页器  -->
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10, 20, 50]"
          :page-size="limit"
          :page-count="7"
          layout="prev,pager,next,jumper,-> ,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>

      <!-- 添加||修改 -->
      <div v-show="scene == 1">
        <spu-form ref="SpuForm" @changeScene="changeScene"></spu-form>
      </div>
      <!-- 添加sku -->
      <div v-show="scene == 2">
        <sku-form ref="SkuForm" @changeScene="changeScene"></sku-form>
      </div>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table v-loading="loading" :data="skuList" style="width: 100%" border>
        <el-table-column
          property="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="width"
        ></el-table-column>
        <el-table-column
          property="weight"
          label="重量"
          width="width"
        ></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'

export default {
  name: 'Spu',
  components: { SkuForm, SpuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      records: [], //spu列表
      total: 0,
      scene: 0, //0代表展示列表数据，1 添加||修改 2 添加sku
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true
    }
  },
  methods: {
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        //代表三级分类的id有了
        this.category3Id = categoryId
        //发请求获取数据
        this.getSpuList()
      }
    },
    async getSpuList(pages = 1) {
      this.page = pages
      let result = await this.$API.spu.reqSpuList(
        this.page,
        this.limit,
        this.category3Id
      )
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    addSpu() {
      this.scene = 1
      this.$refs.SpuForm.addSpuData(this.category3Id)
    },
    addSku(row) {
      this.scene = 2
      this.$refs.SkuForm.getData(this.category1Id, this.category2Id, row)
    },
    updateSpu(row) {
      this.scene = 1
      this.$refs.SpuForm.init(row)
    },
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    async handleSkuList(row) {
      this.dialogTableVisible = true
      this.spu = row
      let result = await this.$API.spu.reqSkuList(row.id)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    close(done) {
      this.skuList = []
      this.loading = true
      done()
    }
  }
}
</script>

<style lang="less" scoped></style>
