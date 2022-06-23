<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px, 0px"
      @click="showDialog"
    ></el-button>
    <el-table style="width: 100%; margin: 20px 0px" border :data="pageList">
      <el-table-column
        type="index"
        align="center"
        prop="prop"
        label="序号"
        width="80px"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="uppdataTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deteleTradeMark(row)"
            >删除</el-button
          >
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
      @current-change="getPageList"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 对话框
    visible控制对话框显示与隐藏
    -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 将表单元素的数据收集 ：model -->
      <el-form ref="ruleForm" :rules="rules" style="width: 80%" :model="tmForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据不能使用-model，不是表单元素
            action：设置图片上传的地址
            on-success 可以检测到图片上传成功
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUppdataTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称为2-10位字符'))
      } else {
        callback()
      }
    }
    return {
      page: 1,
      limit: 10,
      total: 0,
      pageList: [],
      dialogFormVisible: false,
      imageUrl: '',
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请选择活动区域' }]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.pageList = result.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    showDialog() {
      this.dialogFormVisible = true
      //清空取消上传留下的数据
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    uppdataTradeMark(row) {
      this.dialogFormVisible = true
      this.tmForm = { ...row }
    },
    handleAvatarSuccess(res, file) {
      //res、file   图片上传成功返回的数据
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //添加按钮||修改
    addOrUppdataTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false
          let result = await this.$API.tradeMark.reqUppdataTradeMarkList(
            this.tmForm
          )
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌信息成功' : '添加品牌成功'
            })
            //判断是否留在当前页，添加则在第一页
            this.getPageList(
              this.tmForm.id ? this.page : Math.ceil(this.total / this.limit)
            )
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deteleTradeMark(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPageList(this.pageList.length ? this.page : 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
