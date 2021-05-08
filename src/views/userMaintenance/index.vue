<template>
  <div class="maintenance-container">
    <!-- <div class="maintenance-text">{{ name }}</div> -->
    <div class="header-area">
      <div class="search-input">
        <el-input v-model="searchtxt" placeholder="请输入用户姓名" clearable>
          <el-button slot="append" icon="el-icon-search" @click="searchUser" />
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

    </div>
    <!-- 新增 -->
    <el-dialog title="增加用户" :visible.sync="addStatus" width="38%" @close="closeDialog">
      <el-form
        ref="form"
        class="dialog-form"
        :model="form"
        label-width="80px"
        :rules="rules"
      >
        <!-- <el-form-item label="用户编号" prop="userNo">
            <el-input
              v-model="form.userNo"
              class="w350"
              placeholder="请输入用户编号"
              clearable
            />
          </el-form-item> -->
        <el-form-item label="用户姓名" prop="userName">
          <el-input
            v-model="form.userName"
            class="w350"
            placeholder="请输入用户姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属部门" prop="userDept">
          <el-input
            v-model="form.userDept"
            class="w350"
            placeholder="请输入所属部门"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="增加用户" :visible.sync="showUserMsg" width="38%">
      <div class="success-logo">
        <i class="el-icon-check" />
      </div>
      <div class="success-text">用户增加成功</div>
      <el-form :model="userinfo" class="dialog-form" label-width="80px">
        <el-form-item label="用户编号">
          <el-input v-model="userinfo.userNo" class="w350" disabled />
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="userinfo.userPassword" class="w350" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="showUserMsg = false"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="table-left">
          <el-button class="change-blue" @click="freeze(0)">
            冻结
          </el-button>
          <el-button class="change-blue" @click="freeze(1)">
            解冻
          </el-button>
          <el-button class="change-blue" @click="powerStatus = true">
            权限等同
          </el-button>
          <el-button class="change-blue" @click="resetPassword">
            密码重置
          </el-button>
          <!-- 权限等同 -->
          <el-dialog title="权限等同" :visible.sync="powerStatus" width="38%">
            <el-form
              ref="powerform"
              class="dialog-form"
              :model="powerform"
              label-width="150px"
            >
              <el-form-item label="权限等同于用户编号">
                <el-select v-model="powerform.userNo" clearable filterable placeholder="请选择用户编号" class="w350">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="powerStatus = false">取 消</el-button>
              <el-button v-debounce="powerSubmit" type="primary">确 定</el-button>
            </div>
          </el-dialog>

          <!-- @selection-change="handleSelectionChange"
            @row-click="clickData" -->
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;"
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
            <el-table-column prop="userNo" label="用户编号" />
            <el-table-column prop="userName" label="用户姓名" />
            <el-table-column
              prop="userDept"
              label="所属部门"
              show-overflow-tooltip
            />
            <el-table-column
              prop="status"
              label="用户状态"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status == 0 ? 'info' : 'success'"
                  disable-transitions
                >{{ scope.row.status == 1 ? "正常" : "冻结" }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="table-right">
          <el-button class="change-blue" @click="changeRoles">
            修改角色
          </el-button>
          <el-dialog title="设置角色" :visible.sync="dialogFormVisible">
            <el-transfer v-model="value" :data="roleData" :titles="['未持有角色', '已持有角色']" @change="transferRoles" />
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="confirmSetting"
              >确 定</el-button>
            </div>
          </el-dialog>
          <div class="arrow-bar" />
          <div ref="arrow" class="arrow" style="top: 154px" />
          <el-table :data="tableData1" style="width: 100%">
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="roleDesc" label="角色描述" />
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryList, getRoles, updateRole, add, updateStatus, syncRole, resetPwd } from '@/api/userMaintenance'
import { mapGetters } from 'vuex'
export default {
  name: 'UserMaintenance',
  data() {
    const userName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入用户姓名'))
      } else if (value.length > 30) {
        callback(new Error('用户姓名不超过30个字符'))
      } else {
        callback()
      }
    }
    const userDept = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入所属部门'))
      } else if (value.length > 50) {
        callback(new Error('所属部门不超过50个字符'))
      } else {
        callback()
      }
    }
    return {
      radio: 0,
      roleData: [],
      value: [],
      userNo: '',
      ids: [],
      powerform: {
        userNo: ''
      },
      form: {
        userName: '',
        userDept: ''
      },
      rules: {
        userName: [
          { required: true, trigger: 'blur', validator: userName }
        ],
        userDept: [
          { required: true, trigger: 'blur', validator: userDept }
        ]
      },
      userinfo: {
        userNo: '',
        userPassword: ''
      },
      addStatus: false,
      showUserMsg: false,
      powerStatus: false,
      dialogFormVisible: false,
      searchtxt: '',
      tableData: [

      ],
      options: [],
      index: 0,
      tableData1: [

      ],
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
    this.queryList({})
    // this.$refs.multipleTable.setCurrentRow(this.tableData[0])
  },
  methods: {
    setHeight() {
      const bodyHeight = document.body.getBoundingClientRect().height
      const dom1 = document.querySelector('.maintenance-container .table-left')
      const dom3 = document.querySelector('.maintenance-container .table-left .el-table__body-wrapper')
      const dom2 = document.querySelector('.maintenance-container .table-right')
      const dom4 = document.querySelector('.maintenance-container .table-right .el-table__body-wrapper')
      const dom5 = document.querySelector('.maintenance-container  .arrow-bar')
      this.domheight = bodyHeight - 192
      dom1.style.height = bodyHeight - 192 + 'px'
      dom2.style.height = bodyHeight - 192 + 'px'
      dom3.style.height = bodyHeight - 332 + 'px'
      dom4.style.height = bodyHeight - 332 + 'px'
      dom5.style.height = this.domheight - 4 + 'px'
    },
    searchUser() {
      this.queryList({ userName: this.searchtxt })
    },
    add() {
      this.addStatus = true
    },
    confirmSetting() {
      let arr = this.ids
      arr = Array.from(new Set(arr))
      const brr = arr.map(item => {
        return { id: item }
      })
      updateRole({ userNo: this.userNo, roles: brr }).then(() => {
        this.$message({
          showClose: true,
          type: 'success',
          message: '设置成功'
        })
        this.queryList({})
        this.dialogFormVisible = false
      }).catch(() => {
        this.dialogFormVisible = false
      })
    },
    transferRoles(v) {
      this.ids = [...v]
    },
    changeRoles() {
      this.dialogFormVisible = true
      this.value = []
      getRoles({ userNo: this.userNo }).then(res => {
        this.roleData = res.data.map(item => {
          return { ...item, key: item.id, label: item.roleName, disabled: false }
        })
        this.tableData1.forEach(item => {
          this.value.push(item.id)
          this.roleData.push({ ...item, key: item.id, label: item.roleName, disabled: false })
        })
      })
    },
    queryList(pamams) {
      queryList(pamams).then((res) => {
        this.tableData = res.data.map((item, index) => {
          return { ...item, index }
        })
        this.options = res.data.map(item => {
          return { label: item.userNo, value: item.userNo }
        })
        this.$nextTick(() => {
          this.handleSelectionChange(this.tableData[0])
          // this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(this.tableData[0])
          if (res.data.length === 0) {
            this.tableData1 = []
          } else {
            this.tableData1 = res.data[0].roles
          }
          this.radio = 0
        })
      })
    },
    freeze(status) {
      const str = status ? '解冻' : '冻结'
      this.$confirm(`此操作将${str}用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 状态 0-冻结 1-正常
        updateStatus({ userNo: this.userNo, status }).then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: `${str}用户成功!`
          })
          this.queryList({})
        })
      })
    },
    resetPassword() {
      this.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd({ userNo: this.userNo }).then((res) => {
          this.$message({
            duration: 0,
            showClose: true,
            type: 'success',
            message: '密码重置成功，新的密码为 ' + res.data.userPassword + ' '
          })
        }).catch(() => {
          this.$message({
            showClose: true,
            type: 'error',
            message: '密码重置失败!'
          })
        })
      })
    },
    cancel() {
      this.addStatus = false
    },
    closeDialog() {
      this.$refs['form'].resetFields()
    },
    addSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          add(this.form).then((res) => {
            this.addStatus = false
            this.showUserMsg = true
            const { userNo, userPassword } = res.data
            this.userinfo = { userNo, userPassword }
            this.queryList({})
          }).catch(() => {
            this.addStatus = false
          })
        }
      })
    },
    powerSubmit() {
      if (this.powerform.userNo == this.userNo) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '用户编号不能相同'
        })
      } else if (this.powerform.userNo == '') {
        this.$message({
          showClose: true,
          type: 'error',
          message: '用户编号不能为空'
        })
      } else {
        syncRole({ userNo: this.userNo, syncUserNo: this.powerform.userNo }).then(() => {
          this.$message({
            showClose: true,
            type: 'success',
            message: '设置成功'
          })
          this.powerStatus = false
          this.queryList({})
        }).catch(() => {
          this.powerStatus = false
        })
      }
    },
    clickData(row) {
      this.radio = row.index
      this.handleSelectionChange(row)
    },
    handleSelectionChange(row) {
      this.ids = []
      const { roles, userNo, index } = row
      roles.forEach(item => {
        if (item) {
          this.ids.push(item.id)
        }
      })
      this.tableData1 = roles
      this.userNo = userNo
      this.index = index
      const dom = document.querySelectorAll(
        '.table-left .el-table__body-wrapper table tbody tr'
      )
      dom.forEach((item) => {
        item.className = item.className.replace('showbg', ' ')
      })
      dom[this.index].className += ' showbg'
      this.$nextTick(() => {
        const obj = dom[this.index].getBoundingClientRect()
        const fathertop = document
          .querySelector('.table-right')
          .getBoundingClientRect().top
        this.$refs.arrow.style.top =
            obj.top - fathertop + obj.height / 2 - 10 + 'px'
      })
    }
  }
}
</script>

<style lang="scss">

.maintenance-container {
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
    position: relative;
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
    padding-right: 0;
  }
  .el-button + .el-button {
    margin-left: 20px;
  }
  .arrow-bar {
    position: absolute;
    left: 0px;
    top: 2px;
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
