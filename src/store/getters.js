const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userNo: state => state.user.userNo,
  isUnsafeStatus: state => state.user.isUnsafeStatus,
  name: state => state.user.name
}
export default getters
