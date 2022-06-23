<template>
  <el-form :inline="true" :model="formData" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select
        v-model="formData.category1Id"
        placeholder="请选择"
        :disabled="show"
        @change="handler1"
      >
        <el-option
          v-for="c1 in List1"
          :key="c1.id"
          :label="c1.name"
          :value="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        v-model="formData.category2Id"
        placeholder="请选择"
        :disabled="show"
        @change="handler2"
      >
        <el-option
          v-for="c2 in List2"
          :key="c2.id"
          :label="c2.name"
          :value="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        v-model="formData.category3Id"
        placeholder="请选择"
        :disabled="show"
      >
        <el-option
          v-for="c3 in List3"
          :key="c3.id"
          :label="c3.name"
          :value="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :disabled="show" @click="handler3"
        >查询</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: { show: Boolean },
  data() {
    return {
      List1: [],
      List2: [],
      List3: [],
      formData: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List()
      if (result.code == 200) {
        this.List1 = result.data
      }
    },
    async handler1() {
      this.List2 = []
      this.List3 = []
      this.formData.category2Id = ''
      this.formData.category3Id = ''
      const { category1Id } = this.formData
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      let result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code == 200) {
        this.List2 = result.data
      }
    },
    async handler2() {
      this.List3 = []
      this.formData.category3Id = ''
      const { category2Id } = this.formData
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      let result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code == 200) {
        this.List3 = result.data
      }
    },
    handler3() {
      const { category3Id } = this.formData
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style scoped></style>
