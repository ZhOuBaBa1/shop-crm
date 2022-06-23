<template>
  <div>
    <el-card style="margin: 20px 0px"
      ><CategorySelect
        :show="!isShowTable"
        @getCategoryId="getCategoryId"
      ></CategorySelect
    ></el-card>
    <div v-show="isShowTable">
      <el-card>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="clear"
          >添加属性</el-button
        >
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrList">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="attrValueList"
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{ row }">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                type="success"
                style="margin: 0px 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            width="180px"
            align="center"
            border
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="uppdateAttr(row)"
                >修改</el-button
              >

              <el-popconfirm
                :title="`是否确定删除${row.valueName}？`"
                @onConfirm="deteleAttrValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="detele(row)"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-show="!isShowTable">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="属性名">
          <el-input
            v-model="attrInfo.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrInfo.attrName"
        @click="addAttrValue"
        >添加属性值</el-button
      >
      <el-table
        :data="attrInfo.attrValueList"
        style="width: 100%; margin: 20px 0px"
        border
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80"
        ></el-table-column>
        <el-table-column label="属性值名称" width="width">
          <template slot-scope="{ row, $index }">
            <!-- span与input来回切换，为给个属性值添加一个flag标记 -->
            <el-input
              v-if="row.flag"
              :ref="$index"
              v-model="row.valueName"
              placeholder="请输入属性值名称"
              size="mini"
              @blur="toLook(row)"
              @keyup.native.enter="toLook(row)"
            ></el-input>
            <!-- 自动焦点 -->
            <span v-else style="display: block" @click="toEdit(row, $index)">{{
              row.valueName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="width">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        :disabled="attrInfo.attrValueList.length < 1"
        @click="addOrUppdateAttr"
        >保存</el-button
      >
      <el-button @click="isShowTable = true">取消</el-button>
    </div>
  </div>
</template>

<script>
//按需引入深拷贝
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //接受平台属性的数据
      attrList: [],
      //这个属性控制table表格显示与隐藏的
      isShowTable: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: '', //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3 //因为服务器也需要区分几级id
      }
    }
  },
  methods: {
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
        //发请求获取平台的属性数据
        this.getAttrList()
      }
    },
    async getAttrList() {
      //获取分类的ID
      const { category1Id, category2Id, category3Id } = this
      //获取属性列表的数据
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code == 200) {
        this.attrList = result.data
      }
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    //失去焦点的事件--切换为查看模式,属性值为空切换失效，需要判断
    toLook(row) {
      if (row.valueName.trim() == '') {
        this.$message('请输入合理的属性值')
        return
      }
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //将row从数组中去除
        if (row !== item) {
          return row.valueName == item.valueName
        }
      })
      if (isRepat) {
        this.$message('属性值重复')
        return
      }

      row.flag = false
    },
    clear() {
      this.isShowTable = false
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    uppdateAttr(row) {
      this.isShowTable = false
      //将选中的属性赋值给attrInfo
      //由于数据属于双向绑定，而且结构复杂，所浅拷贝不能满足需求，需要进行深拷贝
      this.attrInfo = cloneDeep(row)
      //vue无法检测普通的新增property
      this.attrInfo.attrValueList.forEach((item) => {
        //对象，添加的响应式属性，值
        this.$set(item, 'flag', false)
      })
    },
    toEdit(row, index) {
      row.flag = true
      //$nextTick，当节点渲染完毕，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    //2.13的elementUi的气泡提示框的点击事件为  onConfirm  之后为confirm
    deteleAttrValue(index) {
      //当前未发请求
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async addOrUppdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != '') {
            delete item.flag
            return true
          }
        }
      )
      try {
        await this.$API.attr.reqAddAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
