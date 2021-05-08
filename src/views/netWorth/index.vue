<template>
  <div class="newworth-fund-container">
    <div class="header-area">
      <div class="header-area-left">
        <span>私募基金</span>
        <div class="left-search">
          <el-select
            v-model="searchtxt"
            class="w350"
            filterable
            allow-create
            placeholder="请选择私募基金"
            clearable
          >
            <el-option
              key="defaultone"
              :disabled="true"
              lable="基金代码"
              value="基金名称"
            >
              <div class="selectItem title">
                <div class="left">基金代码</div>
                <div class="right">基金名称</div>
              </div>
            </el-option>
            <el-option
              v-for="item in options1"
              :key="item.label"
              :label="item.label +' ' +item.title"
              :value="item.value"
            >
              <div class="selectItem">
                <div class="left">{{ item.label }}</div>
                <div class="right">{{ item.title }}</div>
              </div>
            </el-option>
          </el-select>
        </div>
        <el-button v-debounce="searchData" class="change-blue" size="medium">
          查询
        </el-button>

      </div>
      <div class="header-area-right">
        <el-button style="float:left;" type="primary" icon="el-icon-plus" size="medium" @click="addOne">
          新增
        </el-button>
        <el-button type="success" icon="el-icon-upload" size="medium" @click="clickBtnUpload">
          导入
        </el-button>
        <input
          ref="input"
          type="file"
          name="file"
          accept="xlsx"
          style="display:none"
          multiple
          @change="handleFileChange"
        >
        <el-button
          style="float:left;margin-left:20px;"
          size="medium"
          type="warning"
          icon="el-icon-download"
          @click="saveFile"
        >下载模板</el-button>
      </div>
    </div>
    <div class="table-content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="基金代码" width="150">
          <template slot-scope="scope">
            {{ scope.row.fundCode }}
          </template>
        </el-table-column>
        <el-table-column prop="fundName" label="基金名称" min-width="160" />
        <el-table-column prop="navDate" label="净值日期" width="200" />
        <el-table-column prop="unitNav" label="单位净值" />
        <el-table-column prop="totalNav" label="累计净值" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link class="link-img" :underline="false" @click="deleteOne(scope.row)">
              <!-- <img :src="deleteimg"> -->
              <div class="link-delete-img" />
            </el-link>
            <el-link class="link-img" :underline="false" @click="editOne(scope.row)">
              <!-- <img :src="editimg"> -->
              <div class="link-edit-img" />
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="statusTitle" :visible.sync="addStatus" width="38%" @close="closeDialog">
        <el-form ref="form" class="dialog-form" :rules="rules" :model="form" label-width="130px">
          <el-form-item label="私募基金代码/名称" prop="fundCode">
            <el-select
              v-model="form.fundCode"
              class="w350"
              filterable
              allow-create
              placeholder="请选择私募基金代码/名称"
              :disabled="isDisabled"
            >
              <el-option
                key="defaultone"
                :disabled="true"
                lable="基金代码"
                value="基金名称"
              >
                <div class="selectItem title">
                  <div class="left">基金代码</div>
                  <div class="right">基金名称</div>
                </div>
              </el-option>
              <el-option
                v-for="item in options1"
                :key="item.label"
                :label="item.label +' ' +item.title"
                :value="item.value"
              >
                <div class="selectItem">
                  <div class="left">{{ item.label }}</div>
                  <div class="right">{{ item.title }}</div>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="净值日期" prop="navDate">
            <el-date-picker
              v-model="form.navDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width:350px"
              placeholder="请选择净值日期"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item label="单位净值" prop="unitNav">
            <el-input v-model="form.unitNav" class="w350" placeholder="请输入单位净值" clearable />
          </el-form-item>
          <el-form-item label="累计净值" prop="totalNav">
            <el-input v-model="form.totalNav" class="w350" placeholder="请输入累计净值" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button v-debounce="addSubmit" type="primary">确 定</el-button>
        </div>
      </el-dialog>
      <el-pagination
        style="margin-top:50px;"
        :current-page="queryObj.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryObj.pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { queryAllList } from '@/api/informationSettings'
import { queryAllListNewWorth, deleteOne, addOne, updateOne, fileUpload, download } from '@/api/netWorth'
// import { getToken } from '@/utils/auth'
export default {
  name: 'SelectedFund',
  data() {
    const fundCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('基金代码/名称不能为空'))
      } else {
        callback()
      }
    }
    const navDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('净值日期不能为空'))
      } else {
        callback()
      }
    }
    const unitNav = (rule, value, callback) => {
      const str = String(value)
      const arr = str.split('.')
      const isNanFlag = isNaN(str)
      if (value === '') {
        callback(new Error('单位净值不能为空'))
      } else if (isNanFlag) {
        callback('单位净值为数字')
      } else if (arr.length == 2 && arr[1].length > 4) {
        callback('单位净值最多4位小数')
      } else {
        callback()
      }
    }
    const totalNav = (rule, value, callback) => {
      const str = String(value)
      const arr = str.split('.')
      const isNanFlag = isNaN(str)
      if (value === '') {
        callback(new Error('累计净值不能为空'))
      } else if (isNanFlag) {
        callback('累计净值为数字')
      } else if (arr.length == 2 && arr[1].length > 4) {
        callback('累计净值最多4位小数')
      } else {
        callback()
      }
    }
    return {
      rules: {
        fundCode: [
          { validator: fundCode, trigger: 'blur' }
        ],
        navDate: [
          { validator: navDate, trigger: 'blur' }
        ],
        unitNav: [
          { validator: unitNav, trigger: 'blur' }
        ],
        totalNav: [
          { validator: totalNav, trigger: 'blur' }
        ]
      },
      statusTitle: '',
      deleteimg: require('@/assets/images/delete.png'),
      editimg: require('@/assets/images/edit.png'),
      addStatus: false,
      isFirstTime: true,
      searchtxt: '',
      doUpload: process.env.VUE_APP_BASE_API + '/oms/fund/private/nav/import',
      downloadurl: process.env.VUE_APP_BASE_API + '/oms/fund/private/nav/downloadTemplate',
      options1: [],
      form: {
        fundCode: '',
        navDate: '',
        unitNav: '',
        totalNav: ''
      },
      copyForm: {},
      tableData: [],
      status: true,
      allList: [],
      queryObj: {
        page: 1,
        pageCount: 10
      },
      total: 0,
      file: {},
      isDisabled: false
    }
  },
  mounted() {
    const bodyHeight = document.body.getBoundingClientRect().height
    const dom = document.querySelector('.newworth-fund-container .table-content')
    dom.style.minHeight = bodyHeight - 192 + 'px'
    this.queryAllList({})
    this.queryAllListNewWorth(this.queryObj)
  },
  methods: {
    saveFile() {
      var a = document.createElement('a')
      download().then(res => {
        // for IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(res.data, '模板.xlsx')
          return
        }
        var url = URL.createObjectURL(res.data)
        a.href = url
        // a.download = res.name
        a.download = '模板.xlsx'
        // a.download = ''
        a.click()
        // 释放之前创建的URL对象
        window.URL.revokeObjectURL(url)
      })
    },
    clickBtnUpload() {
      this.$refs.input.value = null
      this.$refs.input.click()
    },
    handleFileChange(event) {
      const [file] = event.target.files
      if (!file) {
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        this.$message({
          type: 'warning',
          message: '文件大小不大于10M！'
        })
        return
      }
      const form = new FormData()
      form.append('isDuplicateUpload', 0)
      form.append('file', file)
      fileUpload(form)
        .then((res) => {
          if (res.code == '0' && res.data && res.data.duplicateList && res.data.duplicateList.length > 0) {
            this.$confirm(`表格存在重复数据，是否选择继续导入?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log(form)
              form.delete('isDuplicateUpload')
              form.append('isDuplicateUpload', 1)
              fileUpload(form).then((v) => {
                if (v.code == 1) {
                  this.$message({
                    type: 'success',
                    message: '导入成功'
                  })
                }
              })
            })
          }
          if (res.code == '1') {
            this.$message({
              type: 'success',
              message: '导入成功'
            })
          }
        })
    },

    searchData() {
      this.queryObj.page = 1
      this.queryObj.fundCode = this.searchtxt
      this.queryAllListNewWorth(this.queryObj)
    },
    queryAllListNewWorth(params) {
      queryAllListNewWorth(params).then(res => {
        this.total = res.data.total
        this.tableData = res.data.data.map((item, index) => {
          item.totalNav = (item.totalNav).toFixed(4)
          item.unitNav = (item.unitNav).toFixed(4)
          return { ...item, index }
        })
      })
    },
    queryAllList(params) {
      queryAllList(params).then((res) => {
        if (this.isFirstTime) {
          this.isFirstTime = false
          this.allList = res.data
          this.options1 = res.data.map((item) => {
            return { label: item.fundCode, value: item.fundCode, title: item.fundName }
          })
        }
      })
    },
    deleteOne(row) {
      this.$confirm(`此操作将删除, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOne({ id: row.id }).then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: `删除成功!`
          })
          this.queryAllListNewWorth(this.queryObj)
        })
      })
    },
    addOne() {
      this.isDisabled = false
      this.addStatus = true
      this.status = true
      const now = new Date()
      const date = moment(now).format('YYYY-MM-DD')
      this.form = {
        fundCode: '',
        navDate: date,
        unitNav: '',
        totalNav: ''
      }
    },
    editOne(row) {
      this.isDisabled = true
      this.addStatus = true
      this.status = false
      const { fundCode, navDate, unitNav, totalNav, id } = row
      this.copyForm = JSON.parse(JSON.stringify(this.form))

      this.form = {
        fundCode,
        navDate,
        id,
        unitNav,
        totalNav
      }
    },
    closeDialog() {
      this.$refs['form'].resetFields()
    },
    cancel() {
      this.form = this.copyForm
      this.addStatus = false
    },
    addSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let fundName = ''
          this.allList.forEach(item => {
            if (item.fundCode == this.form.fundCode) {
              fundName = item.fundName
            }
          })

          if (this.status) {
            addOne({ ...this.form, unitNav: Number(this.form.unitNav), totalNav: Number(this.form.totalNav), fundName }).then(() => {
              this.$message({
                showClose: true,
                type: 'success',
                message: '新增成功'
              })
              this.queryAllListNewWorth(this.queryObj)
              this.addStatus = false
            })
          } else {
            updateOne({ ...this.form, unitNav: Number(this.form.unitNav), totalNav: Number(this.form.totalNav), fundName }).then(() => {
              this.$message({
                showClose: true,
                type: 'success',
                message: '修改成功'
              })
              this.queryAllListNewWorth(this.queryObj)
              this.addStatus = false
            })
          }
        }
      })
    },
    handleSelectionChange(v) {
      console.log(v)
    },
    handleSizeChange(val) {
      this.queryObj.page = 1
      this.queryObj.pageCount = val
      this.queryAllListNewWorth(this.queryObj)
    },
    handleCurrentChange(val) {
      this.queryObj.page = val
      this.queryAllListNewWorth(this.queryObj)
    }
  }
}
</script>

<style lang="scss">
.newworth-fund-container {
  .header-area {
    display: flex;
    justify-content: space-between;
    padding-bottom: 28px;
    .header-area-left{
      display: flex;
      align-items: center;
      &>span{
        font-size: 14px;
        color: #5A607F;
        line-height: 20px;
      }
    }
    .left-search {
      margin: 0 20px 0 10px;
      &>.el-select{
        width: 350px;
      }
    }
    .el-button + .el-button{
      margin-left: 20px;;
    }

  }
  .table-content {
    width: 100%;
    padding: 28px;
    padding-right: 0;
    background: #fff;
    box-shadow: 0px 1px 4px 0px rgba(21, 34, 50, 0.08);
    border-radius: 6px;
    .selected-table-search.el-select{
        width: 350px;
    }
  }
  .link-delete-img{
      width: 16px;
      height: 20px;
      background-image: url('~@/assets/images/delete.png');
      background-size: 100%;
      background-repeat: no-repeat;
  }
  .link-delete-img:hover{
      background-image: url('~@/assets/images/delete-hover.png');
  }
  .link-edit-img{
    width: 16px;
    height: 20px;
    background-image: url('~@/assets/images/edit.png');
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .link-edit-img:hover{
      background-image: url('~@/assets/images/edit-hover.png');
  }
}
.el-upload-list{
  display: none;
}
</style>
