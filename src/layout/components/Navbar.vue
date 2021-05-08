<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="title-content">金海九州官网后台系统</div>
    <i class="el-icon-switch-button logout" @click="logout" />
    <div class="welcome-content">欢迎你，{{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 68px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 68px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .title-content {
    line-height: 68px;
    height: 100%;
    float: left;
    cursor: pointer;
    font-size: 22px;
    font-weight: 500;
    color: #333752;
  }
  .welcome-content {
    font-size: 14px;
    font-weight: 400;
    height: 68px;
    line-height: 68px;
    color: #5a607f;
    float: right;
  }
  .logout {
    color: #7e84a3;
    float: right;
    margin: 26px 20px 0px 20px;
    font-size: 14px;
    cursor: pointer;
  }
  .breadcrumb-container {
    float: left;
  }
}
</style>
