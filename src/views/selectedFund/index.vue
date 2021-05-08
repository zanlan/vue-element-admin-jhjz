<template>
  <div class="selected-fund-container">
    <div class="header-area">
      <div class="header-area-left">
        <span class="search-lable">全部基金</span>
        <div class="left-search">
          <el-select
            v-model="fundCode"
            class="w350"
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
        </div>
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="searchData">
          增加为精选基金
        </el-button>
      </div>

      <el-button v-debounce="saveRanks" type="success" size="medium">
        保存
      </el-button>
    </div>
    <div class="table-content">
      <!-- default-first-option -->
      <span class="search-lable">精选基金</span>
      <el-select
        v-model="searchtxt2"
        class="w350"
        filterable
        allow-create
        placeholder="请选择精选基金"
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
          v-for="item in options2"
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
      <span class="search-lable">产品类型</span>
      <el-select
        v-model="searchtxt3"
        class="selected-table-search w350"
        filterable
        allow-create
        placeholder="请选择产品类型"
        clearable
      >
        <el-option
          v-for="item in options3"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-debounce="findData" type="primary" size="medium">
        查询
      </el-button>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column label="官网中的显示顺序">
          <template slot-scope="scope">
            <el-input v-model="scope.row.displayOrder" style="width:120px;" />
          </template>
        </el-table-column>
        <el-table-column prop="fundCode" label="精选基金产品代码" />
        <el-table-column prop="fundName" label="精选基金产品名称" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link class="link-img" :underline="false" @click="deleteOne(scope.row)">
              <!-- <img :src="deleteimg"> -->
              <div class="link-delete-img" />
            </el-link>
            <el-link class="link-img" :underline="false" @click="save(scope.row)">
              <div class="link-save-img" />
              <!-- <img :src="saveimg"> -->
            </el-link>
          </template>
        </el-table-column>
      </el-table>
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
import { queryAllList, addChosen, queryChosenList, updateChosenDisplayOrder, deleteChosen, updateChosenDisplayOrderBatch, queryAllChosenFund } from '@/api/selectedFund'
export default {
  name: 'SelectedFund',
  data() {
    return {
      isShowPagination: true,
      deleteimg: require('@/assets/images/delete.png'),
      saveimg: require('@/assets/images/baocun.png'),
      fundCode: '',
      searchtxt2: '',
      searchtxt3: '',
      options1: [],
      options2: [],
      options3: [
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
      tableData: [],
      queryObj: {
        page: 1,
        pageCount: 10
      },
      total: 0
    }
  },
  mounted() {
    const bodyHeight = document.body.getBoundingClientRect().height
    const dom = document.querySelector('.selected-fund-container .table-content')
    dom.style.minHeight = bodyHeight - 192 + 'px'
    queryAllList().then((res) => {
      this.options1 = res.data.map((item) => {
        return { label: item.fundCode, value: item.fundCode, title: item.fundName }
      })
    })
    this.queryChosenList(this.queryObj)
    this.queryAllChosenFund()
  },
  methods: {
    queryAllChosenFund() {
      queryAllChosenFund({}).then(res => {
        this.options2 = res.data.map((item) => {
          return { label: item.fundCode, value: item.fundCode, title: item.fundName }
        })
      })
    },
    findData() {
      this.queryObj.page = 1
      this.queryObj = { ...this.queryObj, fundCode: this.searchtxt2, fundType: this.searchtxt3 }
      this.queryChosenList(this.queryObj)
    },
    searchData() {
      let flag = false
      this.options1.map(item => {
        if (item.label === this.fundCode) {
          this.addSeletedFund()
          flag = true
          return
        }
      })
      if (!flag) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `请选择基金`
        })
      }
    },
    saveRanks() {
      console.log(this.tableData)
      let flag = false
      const brr = this.tableData.map((item, index) => {
        if (item.displayOrder.length > 5 && !flag) {
          flag = true
          this.$message({
            showClose: true,
            type: 'error',
            message: `第${index + 1}条数据的顺序超过了5位数`
          })
        } else if (item.displayOrder.length == '0' && !flag) {
          flag = true
          this.$message({
            showClose: true,
            type: 'error',
            message: `第${index + 1}条数据的顺序不能为空`
          })
        } else if (!/^\d{1,}$/.test(item.displayOrder) && !flag) {
          flag = true
          this.$message({
            showClose: true,
            type: 'error',
            message: `第${index + 1}条数据的顺序应该为纯数字`
          })
        }

        return { id: item.id, displayOrder: item.displayOrder, fundCode: item.fundCode }
      })
      if (flag) {
        return
      }
      updateChosenDisplayOrderBatch({ mutualFunds: brr }).then(() => {
        this.$message({
          showClose: true,
          type: 'success',
          message: `设置成功`
        })
        this.queryChosenList(this.queryObj)
      })
    },
    save(row) {
      this.$confirm(`此操作将设置排序, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let flag = true
        if (row.displayOrder.length > 5) {
          flag = false
          this.$message({
            showClose: true,
            type: 'error',
            message: `顺序超过了5位数`
          })
        } else if (row.displayOrder.length == '0') {
          flag = false
          this.$message({
            showClose: true,
            type: 'error',
            message: `顺序不能为空`
          })
        } else if (!/^\d{1,}$/.test(row.displayOrder)) {
          flag = false
          this.$message({
            showClose: true,
            type: 'error',
            message: `顺序应该为纯数字`
          })
        }
        if (flag) {
          updateChosenDisplayOrder({ displayOrder: row.displayOrder, fundCode: row.fundCode }).then(() => {
            this.queryChosenList(this.queryObj)
            this.$message({
              showClose: true,
              type: 'success',
              message: `设置成功`
            })
          })
        }
      })
    },
    queryChosenList(para) {
      queryChosenList(para).then((res) => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    addSeletedFund() {
      this.$confirm(`此操作将添加精选基金?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.fundCode) {
          this.$message({
            showClose: true,
            type: 'error',
            message: `请选择后，再添加`
          })
          return
        }
        addChosen({ fundCode: this.fundCode }).then(() => {
          this.queryChosenList(this.queryObj)
          this.queryAllChosenFund()
          this.$message({
            showClose: true,
            type: 'success',
            message: `添加成功`
          })
        })
      })
    },
    deleteOne(row) {
      this.$confirm(`此操作将删除, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteChosen({ fundCode: row.fundCode }).then(() => {
          this.queryObj.page = 1
          this.queryChosenList(this.queryObj)
          this.queryAllChosenFund()
          this.$message({
            showClose: true,
            type: 'success',
            message: `删除成功!`
          })
        })
      })
    },
    handleSizeChange(val) {
      this.queryObj.page = 1
      this.queryObj.pageCount = val
      this.queryChosenList(this.queryObj)
    },
    handleCurrentChange(val) {
      this.queryObj.page = val
      this.queryChosenList(this.queryObj)
    }
  }
}
</script>

<style lang="scss">
.selected-fund-container {
  .header-area {
    display: flex;
    justify-content: space-between;
    padding-bottom: 28px;
    .header-area-left{
      align-items: center;
      display: flex;
      justify-content: flex-start;
    }
    .left-search {
      margin: 0 20px 0 10px;
      &>.el-select{
        width: 350px;
      }
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
    .el-select{
       margin: 0 20px 0 10px;
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
  .link-save-img{
    width: 16px;
    height: 20px;
    background-image: url('~@/assets/images/baocun.png');
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .link-save-img:hover{
    background-image: url('~@/assets/images/baocun-hover.png');
  }
}
</style>
