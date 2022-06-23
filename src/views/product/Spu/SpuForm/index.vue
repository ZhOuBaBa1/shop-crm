<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item v-model="spu.spuName" label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌"
          ><el-option
            v-for="item in tmList"
            :key="item.id"
            :value="item.id"
            :label="item.tmName"
          ></el-option
        ></el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="">
        <el-input
          v-model="spu.description"
          type="textarea"
          rows="4"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="SpuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrId"
          :placeholder="`还有${unSelect.length}未选择`"
        >
          <el-option
            v-for="item in unSelect"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名"></el-table-column>
          <el-table-column prop="" label="属性值名称列表">
            <!-- row 即为 spuSaleAttrList -->
            <template slot-scope="{ row, $index }">
              <el-tag
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm" -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row, $index)"
                >添加</el-button
              ></template
            >
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteSaleAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      tmList: [],
      spu: {
        category3Id: 0,
        //描述
        description: '',
        spuName: '',
        tmId: '',
        spuImageList: [
          // {
          //   "id": 0,
          //   "imgName": "string",
          //   "imgUrl": "string",
          //   "spuId": 0
          // }
        ],
        // 平台属性与属性值
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      SpuImageList: [],
      baseSaleAttrList: [],
      attrId: '' //收集未选择属性的id和name
    }
  },
  computed: {
    unSelect() {
      //过滤数组，返回一个新的数组
      let result = this.baseSaleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    //file代表删除的图片，filelist，剩余的图片
    handleRemove(file, fileList) {
      this.SpuImageList = fileList
    },
    //照片墙预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess(responsen, file, fileList) {
      this.SpuImageList = fileList
    },
    async init(spu) {
      let tmresult = await this.$API.spu.reqTradeMartList()
      if (tmresult.code == 200) {
        this.tmList = tmresult.data
      }
      let bsresult = await this.$API.spu.reqBaseSaleAttrList()
      if (bsresult.code == 200) {
        this.baseSaleAttrList = bsresult.data
      }
      let spuresult = await this.$API.spu.reqSpu(spu.id)
      if (spuresult.code == 200) {
        this.spu = spuresult.data
      }
      let imgresult = await this.$API.spu.reqSpuImageList(spu.id)
      if (imgresult.code == 200) {
        let imgList = imgresult.data
        imgList.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.SpuImageList = imgList
      }
    },
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(':')
      let newAttrList = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spu.spuSaleAttrList.push(newAttrList)
      this.attrId = ''
    },
    addSaleAttrValue(row, index) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    handleInputConfirm(row) {
      row.inputVisible = false
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() == '') {
        this.$message('属性值不能为空')
        return
      }
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      )
      if (!result) {
        this.$message('属性值相同')
        return
      }

      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue
      })
    },
    //删除tag
    handleClose(row, index) {
      this.spu.spuSaleAttrList.spuSaleAttrValueList =
        row.spuSaleAttrValueList.splice(index, 1)
    },
    deleteSaleAttr(index) {
      this.spu.spuSaleAttrList = this.spu.spuSaleAttrList.splice(index - 1, 1)
    },
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      let tmresult = await this.$API.spu.reqTradeMartList()
      if (tmresult.code == 200) {
        this.tmList = tmresult.data
      }
      let bsresult = await this.$API.spu.reqBaseSaleAttrList()
      if (bsresult.code == 200) {
        this.baseSaleAttrList = bsresult.data
      }
    },
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.SpuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url
        }
      })

      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('changeScene', {
          scene: 0,
          flag: this.spu.id ? '修改' : '添加'
        })
      } else {
        this.$message({
          type: 'danger',
          message: `${result.message}`
        })
      }
      Object.assign(this._data, this.$options.data())
    },
    //取消按钮
    cancle() {
      this.$emit('changeScene', {
        scene: 0,
        flag: this.spu.id ? '修改' : '添加'
      })
      //清理数据
      //Object.assign:为es6新增的方法，可以合并对象
      //组件实例 this._data
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
