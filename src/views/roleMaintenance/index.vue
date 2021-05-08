<template>
  <div class="role-maintenance-container">
    <div class="header-area">
      <div class="search-input">
        <el-input v-model="searchtxt" placeholder="请输入角色名称" clearable>
          <el-button slot="append" icon="el-icon-search" @click="searchRoles" />
        </el-input>
      </div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="medium"
        @click="add"
      >
        新增
      </el-button>
      <!-- 新增 -->
      <el-dialog title="新增角色" :visible.sync="addStatus" width="38%" @close="closeDialog">
        <el-form
          ref="form"
          class="dialog-form"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="form.roleName"
              class="w350"
              placeholder="请输入角色名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input
              v-model="form.roleDesc"
              class="w350"
              placeholder="请输入角色描述"
              clearable
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addStatus = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增角色" :visible.sync="showUserMsg" width="38%" @closed="handleClose">
        <div class="success-logo">
          <i class="el-icon-check" />
        </div>
        <div class="success-text">角色增加成功</div>

        <el-form :model="form" class="dialog-form" label-width="80px">
          <el-form-item label="角色名称">
            <el-input :value="form.roleName" class="w350" disabled />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input :value="form.roleDesc" class="w350" disabled />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="cancelMessage"
          >确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="table-left">
          <el-button class="change-blue" @click="deleteOne"> 删除 </el-button>
          <!-- @row-click="clickData"
            @selection-change="handleSelectionChange" -->
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
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="roleDesc" label="角色描述" />
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="table-right">
          <el-button
            v-if="!isShowSelection"
            class="role-change change-blue"
            @click="changeRoles"
          >
            修改
          </el-button>
          <div class="arrow-bar" />
          <div ref="arrow" class="arrow" style="top: 154px" />
          <el-table
            v-if="isShowSelection"
            key="111"
            ref="defaultSelect"
            :data="tableData2"
            style="width: 100%"
            class="role-name"
            tooltip-effect="dark"
            @selection-change="changeSelect"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="菜单权限">
              <template slot-scope="scope">{{ scope.row.permsDesc }}</template>
            </el-table-column>
          </el-table>
          <el-table
            v-else
            key="222"
            :data="tableData1"
            style="width: 100%"
            class="role-name"
          >
            <el-table-column label="菜单权限">
              <template slot-scope="scope">{{ scope.row.permsDesc }}</template>
            </el-table-column>
          </el-table>

          <el-button
            v-if="isShowSelection"
            type="primary"
            style="float: right; margin-top: 40px;"
            @click="confirmRoles"
          >
            确认
          </el-button>
          <el-button
            v-if="isShowSelection"
            style="float: right; margin-top: 40px;margin-right:20px;"
            @click="cancelRoles"
          >
            取消
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryList, queryPermission, updatePermission, add, deleteOne } from '@/api/roleMaintenance'
export default {
  name: 'RoleMaintenance',
  data() {
    const roleName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入角色名称'))
      } else if (value.length > 50) {
        callback(new Error('用户姓名不超过50个字符'))
      } else {
        callback()
      }
    }
    return {
      radio: 0,
      isShowSelection: false,
      powerform: {
        usernumber: ''
      },
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, trigger: 'blur', validator: roleName }
        ]
      },
      addStatus: false,
      showUserMsg: false,
      searchtxt: '',
      tableData: [],
      index: 0,
      tableData1: [],
      tableData2: [],
      rolesObj: {},
      id: '',
      domheight: 0
    }
  },
  computed: {
    ...mapGetters(['userNo'])
  },
  mounted() {
    this.setHeight()
    window.onresize = () => {
      this.setHeight()
    }
    this.queryList({})
  },
  methods: {
    setHeight() {
      const bodyHeight = document.body.getBoundingClientRect().height
      const dom1 = document.querySelector('.role-maintenance-container .table-left')
      const dom3 = document.querySelector('.role-maintenance-container .table-left .el-table__body-wrapper')
      const dom2 = document.querySelector('.role-maintenance-container .table-right')
      const dom4 = document.querySelector('.role-maintenance-container .table-right .el-table__body-wrapper')
      const dom5 = document.querySelector('.role-maintenance-container  .arrow-bar')
      this.domheight = bodyHeight - 192
      dom1.style.height = bodyHeight - 192 + 'px'
      dom2.style.height = bodyHeight - 192 + 'px'
      dom3.style.height = bodyHeight - 332 + 'px'
      dom4.style.height = bodyHeight - 332 + 'px'
      dom5.style.height = this.domheight - 4 + 'px'
    },
    handleClose() {
      this.addStatus = false
    },
    cancelMessage() {
      this.showUserMsg = false
      this.addStatus = false
    },
    add() {
      this.addStatus = true
      this.form = {
        roleName: '',
        roleDesc: ''
      }
    },
    searchRoles() {
      this.queryList({ roleName: this.searchtxt })
    },
    cancelRoles() {
      this.isShowSelection = false
    },
    confirmRoles() {
      updatePermission(this.rolesObj).then(() => {
        this.$message({
          showClose: true,
          type: 'success',
          message: '更新成功'
        })
        this.isShowSelection = false
        this.queryList({})
      }).catch(() => {
        this.isShowSelection = false
      })
    },
    changeRoles() {
      this.isShowSelection = true
      queryPermission().then((res) => {
        this.tableData2 = res.data
        this.tableData2.forEach((item1, index1) => {
          this.tableData1.forEach(item2 => {
            if (item1.id === item2.id) {
              this.$nextTick(() => {
                this.$refs.defaultSelect.toggleRowSelection(this.tableData2[index1])
              })
            }
          })
        })
      })
    },
    queryList(pamams) {
      queryList(pamams).then((res) => {
        this.tableData = res.data.map((item, index) => {
          return { ...item, index }
        })
        this.$nextTick(() => {
          this.handleSelectionChange(this.tableData[0])
          this.radio = 0
          // this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(this.tableData[0])
          if (res.data.length === 0) {
            this.tableData1 = []
          }
        })
      })
    },
    changeSelect(arr) {
      const permissions = [...arr].map(item => {
        return { id: item.id }
      })
      this.rolesObj = {
        id: this.id + '',
        permissions
      }
    },
    deleteOne() {
      this.$confirm(`此操作将删除角色, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOne({ id: this.id, isForceDelete: 0 }).then((res) => {
          if (res.code === '00100010001') {
            this.$confirm(`该角色存在关联用户，是否强制删除?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              deleteOne({ id: this.id, isForceDelete: 1 }).then(() => {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '删除成功'
                })
                this.queryList({})
              })
            })
          } else {
            this.queryList({})
          }
        })
      })
    },
    closeDialog() {
      this.$refs['form'].resetFields()
    },
    addSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // console.log(this.form)
          add(this.form).then(() => {
            this.$message({
              showClose: true,
              type: 'success',
              message: '添加成功'
            })
            this.queryList({})
            this.showUserMsg = true
          }).catch(() => {
            this.$message({
              showClose: true,
              type: 'error',
              message: '添加失败'
            })
            this.addStatus = false
          })
        }
      })
    },
    powerSubmit() {
      console.log(this.powerform)
    },

    clickData(row) {
      this.radio = row.index
      this.handleSelectionChange(row)
    },
    handleSelectionChange(row) {
      this.isShowSelection = false
      const { permissions, index, id } = row
      this.tableData1 = permissions
      this.id = id
      this.index = index
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
.role-maintenance-container {
  .header-area {
    display: flex;
    justify-content: space-between;
    padding-bottom: 28px;
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
    .showbg {
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
    .role-change {
      position: absolute;
      left: 28px;
      top: 28px;
    }
  }
  .el-button + .el-button {
    margin-left: 20px;
  }

  .arrow-bar {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 2px;
    background: #1e5eff;
  }
  .arrow {
    position: absolute;
    left: 2px;
    top: 116px;
    width: 0;
    height: 0;
    border: 11px solid transparent;
    border-left: 11px solid #1e5eff;
  }
  .el-table {
    margin-top: 20px;
  }
  .el-table.role-name {
    margin-top: 60px;
  }
  .success-logo {
    margin: 0 auto;
    width: 58px;
    height: 58px;
    background: #ecf2ff;
    border-radius: 50%;
    text-align: center;
    line-height: 58px;
    & > i {
      font-size: 16px;
      color: #1e5eff;
    }
  }
  .success-text {
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
