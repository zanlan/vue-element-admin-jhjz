<template>
  <div class="information-maintenance-container">
    <div class="header-area">
      <span class="search-lable">基金代码/名称</span>
      <el-select
        v-model="searchtxt1"
        class="w350"
        style="margin:0 60px 0 10px;"
        filterable
        allow-create
        placeholder="请选择基金代码"
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
      <el-button v-debounce="searchData" size="medium" class="change-blue">
        查询
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="table-left">

          <!-- @selection-change="handleSelectionChange" -->
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            class="clickable"
            @row-click="clickData"
          >
            <el-table-column
              prop="status"
              label=""
              width="50"
            >
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index" class="no-show-content" @change="handleSelectionChange(scope.row)">-</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="基金代码">
              <template slot-scope="scope">{{ scope.row.fundCode }}</template>
            </el-table-column>
            <el-table-column prop="fundName" label="基金名称" />
          </el-table>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="table-right">
          <div class="arrow-bar" />
          <div ref="arrow" class="arrow" style="top:154px" />
          <el-button type="danger" style="float:right;" icon="el-icon-delete" @click="deleteOne"> 删除 </el-button>
          <el-button type="success" style="float:right;margin:0 20px;" icon="el-icon-edit" @click="editOne"> 修改 </el-button>
          <el-button type="primary" style="float:right;" icon="el-icon-plus" @click="addOne"> 新增 </el-button>
          <el-form ref="form" :model="form" :rules="rules" class="information-form" label-width="140px" style="margin-top:60px;padding:0 30px 0;">
            <el-form-item label="基金代码" prop="fundCode">
              <el-input v-model="form.fundCode" maxlength="6" style="width:90%;" placeholder="请输入基金代码" :disabled="isNoCanEdit1" clearable />
            </el-form-item>
            <el-form-item label="基金名称" prop="fundName">
              <el-input v-model="form.fundName" style="width:90%;" placeholder="请输入基金名称" :disabled="isNoCanEdit1" clearable />
            </el-form-item>
            <el-form-item label="成立日" prop="establishDate">
              <el-date-picker
                v-model="form.establishDate"
                style="width:90%;"
                type="date"
                placeholder="请输入成立日"
                value-format="yyyy-MM-dd"
                :disabled="isNoCanEdit"
                clearable
              />
            </el-form-item>
            <el-form-item label="成立日净值" prop="establishDateNav">
              <el-input v-model="form.establishDateNav" style="width:90%;" placeholder="请输入成立日净值" :disabled="isNoCanEdit" clearable />
            </el-form-item>
            <el-form-item label="产品类型" prop="fundType">
              <el-select
                v-model="form.fundType"
                style="width:90%;"
                filterable
                allow-create
                placeholder="请选择产品类型"
                :disabled="isNoCanEdit"
              >
                <el-option
                  v-for="item in value5"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="产品风险等级" prop="fundRiskLevel">
              <el-select
                v-model="form.fundRiskLevel"
                style="width:90%;"
                filterable
                allow-create
                placeholder="请选择产品风险等级"
                :disabled="isNoCanEdit"
              >
                <el-option
                  v-for="item in value6"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="产品起购金额" prop="minInvestAmount">
              <el-input v-model="form.minInvestAmount" style="width:90%;margin-right:10px;" placeholder="请输入产品起购金额" :disabled="isNoCanEdit" clearable />
              <span>万</span>
            </el-form-item>
            <el-form-item label="业绩报酬计提基准" prop="performanceRewardStandard">
              <el-input v-model="form.performanceRewardStandard" style="width:90%;margin-right:10px;" placeholder="请输入业绩报酬计提基准" :disabled="isNoCanEdit" clearable />
              <span>%</span>
            </el-form-item>
            <div style="font-size:14px;color:red;">温馨提示：</div>
            <div style="font-size:14px;color:red;">1."起购金额"后面带单位"万"，例如起购金额为100万，输入框输入100即可。</div>
            <div style="font-size:14px;color:red;">2."业绩报酬计提基准"后面带单位"%"，例如业绩报酬计提基准为6.8%，输入框输入6.8即可。</div>
          </el-form>
          <el-button v-if="!isNoCanEdit" v-debounce="save" type="primary" style="float:right;"> 确认 </el-button>
          <el-button v-if="!isNoCanEdit" style="float:right;margin-right:20px;" @click="cancel"> 取消 </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryAllList, update, add, deleteOne } from '@/api/informationSettings'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'InformationSettings',
  data() {
    const fundCode = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入基金代码'))
      } else if (value.length < 6) {
        callback(new Error('基金代码为6位'))
      } else if (!/^[0-9A-Za-z]{1,}$/.test(value)) {
        callback(new Error('基金代码为字母和数字组合'))
      } else {
        callback()
      }
    }
    const fundName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入基金名称'))
      } else if (value.length > 50) {
        callback(new Error('基金名称不超过50个字符'))
      } else {
        callback()
      }
    }
    const minInvestAmount = (rule, value, callback) => {
      const num = parseFloat(value)
      const num2 = parseInt(value)
      const str = String(value)
      if (isNaN(num) || (str[0] === '0' && str[1] !== '.')) {
        callback(new Error('请正确输入起购金额'))
      } else if (num === 0) {
        callback(new Error('起购金额不能为零'))
      } else if (num !== num2) {
        callback(new Error('起购金额为整数'))
      } else if (value.length > 10) {
        callback(new Error('起购金额不能超过10位数'))
      } else {
        callback()
      }
    }
    const performanceRewardStandard = (rule, value, callback) => {
      const num = parseFloat(value)
      const reg = /^[0-9]{0,10}(\.?[0-9]{0,2})?$/
      if (num == 0) {
        callback(new Error('业绩报酬计提基准不能为零'))
      } else if (reg.test(num)) {
        callback()
      } else {
        callback(new Error('业绩报酬计提基准不能超过两位小数，整数位不超过10位数字'))
      }
    }
    const establishDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('成立日不能为空'))
      } else {
        callback()
      }
    }
    const establishDateNav = (rule, value, callback) => {
      const num = parseFloat(value)
      const str = String(value)
      if (isNaN(num) || (str[0] === '0' && str[1] !== '.')) {
        callback(new Error('请正确输入成立日净值'))
      } else if (num === 0) {
        callback(new Error('成立日净值不能为零'))
      } else {
        callback()
      }
    }
    return {
      radio: 0,
      rules: {
        fundCode: [{ required: true, trigger: 'blur', validator: fundCode }],
        fundName: [{ required: true, trigger: 'blur', validator: fundName }],
        minInvestAmount: [{ required: true, trigger: 'blur', validator: minInvestAmount }],
        performanceRewardStandard: [{ required: true, trigger: 'blur', validator: performanceRewardStandard }],
        establishDate: [{ required: true, trigger: 'blur', validator: establishDate }],
        establishDateNav: [{ required: true, trigger: 'blur', validator: establishDateNav }]
      },
      id: 0,
      isNoCanEdit: true,
      isNoCanEdit1: true,
      searchtxt1: '',
      searchtxt2: '',
      options1: [],
      isShowSelection: false,
      value: [1, 4],
      powerform: {
        usernumber: ''
      },
      value5: [
        { value: '0',
          label: '股票型'
        },
        { value: '2',
          label: '货币型'
        },
        { value: 'A',
          label: '混合型'
        },
        { value: 'E',
          label: '债券型'
        }
      ],
      value6: [
        { value: 0,
          label: '低风险等级'
        },
        { value: 1,
          label: '中低风险等级'
        },
        { value: 2,
          label: '中风险等级'
        },
        { value: 3,
          label: '中高风险等级'
        },
        { value: 4,
          label: '高风险等级'
        }
      ],
      form: {
      },

      copyForm: {
      },
      userinfo: {
        usernumber: '',
        userpassword: ''
      },
      addStatus: false,
      showUserMsg: false,
      searchtxt: '',
      tableData: [],
      index: 0,
      status: true,
      isFirstTime: true,
      domheight: 0
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    this.setHeight()
    window.onresize = () => {
      this.setHeight()
    }
    this.queryAllList({})
  },
  methods: {
    setHeight() {
      const bodyHeight = document.body.getBoundingClientRect().height
      const dom1 = document.querySelector('.information-maintenance-container .table-left')
      const dom3 = document.querySelector('.information-maintenance-container .table-left .el-table__body-wrapper')
      const dom2 = document.querySelector('.information-maintenance-container .table-right')
      const dom4 = document.querySelector('.information-maintenance-container  .arrow-bar')
      this.domheight = bodyHeight - 192
      dom1.style.height = bodyHeight - 192 + 'px'
      dom2.style.height = bodyHeight - 192 + 'px'
      dom3.style.height = bodyHeight - 332 + 'px'
      dom4.style.height = this.domheight - 4 + 'px'
    },
    searchData() {
      this.queryAllList({ fundCode: this.searchtxt1 })
    },
    queryAllList(params) {
      queryAllList(params).then((res) => {
        if (this.isFirstTime) {
          this.isFirstTime = false
          this.options1 = res.data.map((item) => {
            return { label: item.fundCode, value: item.fundCode, title: item.fundName }
          })
        }
        this.tableData = res.data.map((item, index) => {
          return { ...item, index }
        })
        this.$nextTick(() => {
          // this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(this.tableData[0])
          this.handleSelectionChange(this.tableData[0])
          this.radio = 0
        })
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.status) {
            // 没有对象数据  则不让修改
            if (this.tableData.length == 0) {
              return
            }
            update({ ...this.form, establishDateNav: Number(this.form.establishDateNav), performanceRewardStandard: Number(this.form.performanceRewardStandard), minInvestAmount: String(this.form.minInvestAmount), id: this.id }).then(() => {
              this.$message({
                showClose: true,
                type: 'success',
                message: `更新成功!`
              })
              this.isNoCanEdit = true
              this.isNoCanEdit1 = true
              this.queryAllList({})
            })
          } else {
            add({ ...this.form, establishDateNav: Number(this.form.establishDateNav), performanceRewardStandard: Number(this.form.performanceRewardStandard), minInvestAmount: String(this.form.minInvestAmount) }).then(() => {
              this.$message({
                showClose: true,
                type: 'success',
                message: `新增成功!`
              })
              this.isNoCanEdit = true
              this.isNoCanEdit1 = true
              this.queryAllList({})
            })
          }
        }
      })
    },
    cancel() {
      this.isNoCanEdit = true
      this.isNoCanEdit1 = true
      this.form = this.copyForm
      this.$refs['form'].resetFields()
    },
    resetdata() {
      const now = new Date()
      const date = moment(now).format('YYYY-MM-DD')
      this.form = {
        fundCode: '',
        fundName: '',
        establishDateNav: 0,
        fundType: '0',
        fundRiskLevel: 0,
        minInvestAmount: 0,
        performanceRewardStandard: 0,
        establishDate: date
      }
    },
    editOne() {
      if (!this.isNoCanEdit || this.tableData.length == 0) {
        return
      }
      this.isNoCanEdit = false
      this.isNoCanEdit1 = true
      this.status = true
      this.copyForm = JSON.parse(JSON.stringify(this.form))
    },
    addOne() {
      if (!this.isNoCanEdit) {
        return
      }
      this.isNoCanEdit = false
      this.isNoCanEdit1 = false
      this.status = false
      this.copyForm = JSON.parse(JSON.stringify(this.form))
      this.resetdata()
    },
    deleteOne() {
      if (this.tableData.length == 0) {
        return
      }
      this.$confirm(`此操作将删除基金, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOne({ id: this.id }).then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: `删除成功!`
          })
          this.queryAllList({})
          this.isNoCanEdit = true
          this.isNoCanEdit1 = true
        })
      })
    },
    clickData(row) {
      this.radio = row.index
      this.handleSelectionChange(row)
    },
    handleSelectionChange(row) {
      const { fundCode, fundName, fundType, fundRiskLevel, minInvestAmount, performanceRewardStandard, establishDate, establishDateNav, index, id } = row
      this.form = {
        fundCode,
        fundName,
        establishDateNav,
        fundType,
        fundRiskLevel,
        minInvestAmount,
        performanceRewardStandard,
        establishDate
      }
      this.index = index
      this.id = id
      const dom = document.querySelectorAll('.table-left .el-table__body-wrapper table tbody tr')
      dom.forEach((item) => {
        item.className = item.className.replace('showbg', ' ')
      })
      dom[this.index].className += ' showbg'
      this.$nextTick(() => {
        const obj = dom[this.index].getBoundingClientRect()
        const fathertop = document.querySelector('.table-right').getBoundingClientRect().top
        this.$refs.arrow.style.top = obj.top - fathertop + obj.height / 2 - 10 + 'px'
      })
    }
  }
}
</script>

<style lang="scss">

.information-maintenance-container {
  .header-area {
    display: flex;
    justify-content: flex-start;
    padding-bottom: 28px;
    align-items: center;
  }
   .el-table{
    .el-table__body-wrapper{
      overflow-y: auto;
    }
  }
  .table-left {
    width: 100%;
    padding: 28px;
    padding-right: 0;
    background: #fff;
    box-shadow: 0px 1px 4px 0px rgba(21, 34, 50, 0.08);
    border-radius: 6px;
    thead tr th:nth-of-type(1) div{
      visibility: hidden;
    }
    .showbg{
      background: #f6f9fa !important;
    }
  }
  .table-right {
    position: relative;
    width: 100%;
    background: #fff;
    box-shadow: 0px 1px 4px 0px rgba(21, 34, 50, 0.08);
    border-radius: 6px;
    padding: 28px;
    .role-change{
      position: absolute;
      left: 28px;
      top: 28px;
    }
    .information-form.el-form{
      .el-form-item__label{
        font-size: 14px;
        color: #5A607F;
        font-weight: 500;
      }
    }
  }
  .arrow-bar{
      position: absolute;
      left: 0px;
      top: 0px;
      width: 2px;
      background: #1E5EFF;
      height: 500px;
  }
  .arrow {
      position: absolute;
      left: 2px;
      top: 116px;
      width: 0;
      height: 0;
      border: 11px solid transparent;
      border-left: 11px solid #1E5EFF;
  }
  .el-table {
    margin-top: 52px;
  }
  .success-logo{
    margin: 0 auto;
    width: 58px;
    height: 58px;
    background: #ECF2FF;
    border-radius: 50%;
    text-align: center;
    line-height: 58px;
    &>i{
      font-size: 16px;
      color: #1E5EFF;
    }
  }
  .success-text{
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    color: #131523;
    line-height: 28px;
    margin: 10px 0 20px 0;
  }
}
</style>
