<template>
  <div class="customer-appointment-container">
    <div class="table-content">
      <div style="display:flex;justify-content:flex-start;">
        <div style="width:500px;">
          <div class="table-content-item">
            <span class="search-lable">预约客户类型</span>
            <el-select
              v-model="reserveType"
              class="selected-table-search w350"
              filterable
              allow-create
              placeholder="请选择预约客户类型"
              clearable
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="table-content-item">
            <span class="search-lable">所在城市</span>
            <el-select
              v-model="reserveCity"
              class="selected-table-search w350"
              filterable
              allow-create
              placeholder="请选择所在城市"
              clearable
            >
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="table-content-item">
            <span class="search-lable">预约姓名</span>
            <el-input v-model="reserveName" placeholder="请输入预约姓名" class="w350" clearable />
          </div>
        </div>
        <div style="width:500px;">
          <div class="table-content-item">
            <span class="search-lable">预约手机号</span>
            <el-input v-model="reservePhoneNo" placeholder="请输入预约手机号" class="w350" clearable />
          </div>

          <div class="table-content-item">
            <span class="search-lable">预约起止时间</span>
            <el-date-picker
              v-model="reserveDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>

          <div class="table-content-item">
            <span class="search-lable">产品</span>
            <el-select
              v-model="reserveFundCode"
              class="selected-table-search w350"
              filterable
              allow-create
              placeholder="请选择产品"
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
                v-for="item in options6"
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
        </div>
        <div class="table-content-button">
          <el-button v-debounce="searchBtn" type="primary" size="medium">
            查询
          </el-button>
        </div>
      </div>
      <el-row style="width:100%">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width:100%;margin-top:20px;"
        >
          <!-- <el-table-column prop="reserveOrderNo" label="预约订单编号" /> -->
          <el-table-column prop="reserveCity" label="所在城市" width="80" />
          <el-table-column prop="reserveType" label="预约类型" />
          <!-- <el-table-column prop="memberNo" label="客户号" /> -->
          <el-table-column prop="memberName" label="客户姓名" width="80" />
          <el-table-column prop="memberPhoneNo" label="客户手机号" />
          <el-table-column prop="reserveName" label="预约姓名" />
          <el-table-column prop="reservePhoneNo" label="预约手机号" />
          <el-table-column prop="createTime" label="预约时间" />
          <el-table-column prop="reserveFundCode" label="预约产品代码" />
          <el-table-column prop="reserveFundName" min-width="150" label="预约产品名称" />
        </el-table>
      </el-row>
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
import { queryAllList } from '@/api/informationSettings'
import { queryList, queryCityList } from '@/api/customerAppointment'
import moment from 'moment'
export default {
  name: 'CustomerAppointment',
  data() {
    return {
      currentPage: 1,
      reserveType: '',
      reserveCity: '',
      reserveName: '',
      reservePhoneNo: '',
      reserveDate: '',
      reserveFundCode: '',
      queryObj: {
        page: 1,
        pageCount: 10
      },
      total: 0,
      options1: [
        {
          value: 1,
          label: '注册客户预约'
        },
        {
          value: 2,
          label: '游客预约'
        }
      ],
      options2: [
      ],
      options6: [],
      tableData: []
    }
  },
  mounted() {
    const bodyHeight = document.body.getBoundingClientRect().height
    const dom = document.querySelector('.customer-appointment-container .table-content')
    dom.style.minHeight = bodyHeight - 124 + 'px'
    this.queryList({ page: 1, pageCount: 10 })
    this.queryAllList()
    const now = new Date() * 1
    const prevDate = now - 2592000000
    const firstOne = moment(prevDate).format('YYYY-MM-DD')
    console.log(firstOne)
    const lastOne = moment(now).format('YYYY-MM-DD')
    this.reserveDate = [firstOne, lastOne]

    queryCityList({}).then((res) => {
      // res.data
      this.options2 = res.data.map(item => {
        if (item.reserveCity) {
          return { value: item.reserveCity, label: item.reserveCity }
        }
      })
      this.options2 = this.options2.filter(item => {
        if (item) {
          return item
        }
      })
    })
  },
  methods: {
    searchBtn() {
      if (this.reserveDate) {
        this.queryList({
          reserveType: this.reserveType,
          reserveCity: this.reserveCity,
          reserveName: this.reserveName,
          reservePhoneNo: this.reservePhoneNo,
          reserveDateBegin: this.reserveDate[0],
          reserveDateEnd: this.reserveDate[1],
          reserveFundCode: this.reserveFundCode,
          page: 1,
          pageCount: this.queryObj.pageCount
        })
      } else {
        this.queryList({
          reserveType: this.reserveType,
          reserveCity: this.reserveCity,
          reserveName: this.reserveName,
          reservePhoneNo: this.reservePhoneNo,
          reserveFundCode: this.reserveFundCode,
          page: 1,
          pageCount: this.queryObj.pageCount
        })
      }
    },
    queryList(params) {
      queryList(params).then((res) => {
        this.tableData = res.data.data.map(item => {
          if (item.reserveType == 1) {
            item.reserveType = '注册客户预约'
          } else if (item.reserveType == 2) {
            item.reserveType = '游客预约'
          }
          return item
        })
        this.total = res.data.total
      })
    },
    queryAllList() {
      queryAllList().then((res) => {
        this.options6 = res.data.map((item) => {
          return { label: item.fundCode, value: item.fundCode, title: item.fundName }
        })
      })
    },
    handleSelectionChange() {

    },
    handleSizeChange(val) {
      this.queryObj.page = 1
      this.queryObj.pageCount = val
      if (this.reserveDate) {
        this.queryList({
          reserveType: this.reserveType,
          reserveCity: this.reserveCity,
          reserveName: this.reserveName,
          reservePhoneNo: this.reservePhoneNo,
          reserveDateBegin: this.reserveDate[0],
          reserveDateEnd: this.reserveDate[1],
          reserveFundCode: this.reserveFundCode,
          page: 1,
          pageCount: val
        })
      } else {
        this.queryList({
          reserveType: this.reserveType,
          reserveCity: this.reserveCity,
          reserveName: this.reserveName,
          reservePhoneNo: this.reservePhoneNo,
          reserveFundCode: this.reserveFundCode,
          page: 1,
          pageCount: val
        })
      }
    },
    handleCurrentChange(val) {
      this.queryObj.page = val
      if (this.reserveDate) {
        this.queryList({
          reserveType: this.reserveType,
          reserveCity: this.reserveCity,
          reserveName: this.reserveName,
          reservePhoneNo: this.reservePhoneNo,
          reserveDateBegin: this.reserveDate[0],
          reserveDateEnd: this.reserveDate[1],
          reserveFundCode: this.reserveFundCode,
          page: val,
          pageCount: this.queryObj.pageCount
        })
      } else {
        this.queryList({
          reserveType: this.reserveType,
          reserveCity: this.reserveCity,
          reserveName: this.reserveName,
          reservePhoneNo: this.reservePhoneNo,
          reserveFundCode: this.reserveFundCode,
          page: val,
          pageCount: this.queryObj.pageCount
        })
      }
    }
  }
}
</script>

<style lang="scss">
.customer-appointment-container {
  .table-content {
    width: 100%;
    padding: 28px;
    background: #fff;
    box-shadow: 0px 1px 4px 0px rgba(21, 34, 50, 0.08);
    border-radius: 6px;
    .el-scrollbar__bar{
      opacity: 1;
    }
    .table-content-item{
      float: left;
      width: 460px;
      height: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 40px;
      margin-bottom: 24px;
      &>span{
        padding-right: 10px;
      }
    }
    .table-content-button{
      margin-top: 130px;
        float: left;
    }

  }
}
</style>
