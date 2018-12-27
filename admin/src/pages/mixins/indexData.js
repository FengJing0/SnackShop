export default {
  data () {
    return {
      tableData: {
        total: 0,
        page: 1,
        data: [],
        length: 10
      }
    }
  },
  methods: {
    getData () {
      this.$axios.get(this.dataUrl, {
        params: {
          page: this.tableData.page,
          size: this.tableData.length
        }
      }).then(res => {
        this.handleData(res)
      }).catch(err => console.log(err))
    },
    handleData () {
      console.error('未正确定义handleData方法')
    },
    handleCurrentChange (e) {
      this.tableData.page = e
      this.getData()
    }
  }
}
