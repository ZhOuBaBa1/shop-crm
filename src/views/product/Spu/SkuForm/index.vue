<template>
  <el-form label-width="80px">
    <el-form-item label="SPU名称">{{ spu.spuName }}}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuInfo.skuName" placeholder="sku名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        v-model="skuInfo.price"
        type="number"
        placeholder="价格(元)"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        v-model="skuInfo.skuDesc"
        type="textarea"
        rows="4"
        placeholder="规格描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form ref="form" :inline="true" label-width="80px">
        <el-form-item
          v-for="attrInfo in attrInfoList"
          :key="attrInfo.id"
          :label="attrInfo.attrName"
        >
          <el-select v-model="attrInfo.attrIdAndValueId" placeholder="请选择">
            <el-option
              v-for="attrValue in attrInfo.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${attrInfo.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="80px">
        <el-form-item
          v-for="saleAttr in spuSaleAttrList"
          :key="saleAttr.id"
          :label="saleAttr.saleAttrName"
        >
          <el-select
            v-model="saleAttr.saleAttrIdAndsaleAttrValueId"
            placeholder="请选择"
          >
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        border
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="图片" width="width">
          <template slot-scope="{ row }"
            ><el-image
              style="width: 100px; height: 100px"
              :src="row.imgUrl"
            ></el-image
          ></template>
        </el-table-column>
        <el-table-column
          prop="imgName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{ row }"
            ><el-button
              v-if="row.isDefault == 0"
              type="primary"
              icon="el-icon-plus"
              @click="defaultImg(row)"
              >设置默认</el-button
            >
            <el-button v-else>默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addSku">保存</el-button>
      <el-button @click="clear">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售是属性
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        //默认图片
        skuDefaultImg: '',
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ]
      },
      spu: {},
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      imageList: []
    }
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      //收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      //获取图片的数据
      let result = await this.$API.spu.reqSpuImageList(spu.id)
      if (result.code == 200) {
        let list = result.data
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      //获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      }
      //获取平台属性的数据
      let result2 = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        spu.category3Id
      )
      if (result2.code == 200) {
        this.attrInfoList = result2.data
      }
    },
    //table表格复选框按钮的事件
    handleSelectionChange(params) {
      //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
      this.imageList = params
    },
    defaultImg(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      //点击的那个图片的数据变为1
      row.isDefault = 1
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    clear() {
      // console.log(this._data)
      // console.log(this.$options)
      Object.assign(this._data, this.$options.data())
      this.$emit('changeScene', { scene: 0 })
    },
    async addSku() {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])

      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndsaleAttrValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndsaleAttrValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '添加SKU成功' })
        this.$emit('changeScene', { scene: 0 })
      }
    }
  }
}
</script>

<style scoped></style>
