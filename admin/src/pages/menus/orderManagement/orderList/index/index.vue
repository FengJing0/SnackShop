<template>
  <Container type="card-full">
    <el-table :data="tableData.data"
              class="rn-mt"
              border
              style="width: 100%">
      <el-table-column prop="order_no"
                       fixed="left"
                       label="订单号"
                       min-width="160" />
      <el-table-column prop="snap_name"
                       label="商品名称"
                       min-width="120" />
      <el-table-column prop="total_count"
                       label="商品总数" />
      <el-table-column prop="total_price"
                       label="商品总价格"
                       min-width="80" />
      <el-table-column prop="status"
                       label="订单状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.statusType"
                  disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time"
                       label="下单时间"
                       min-width="140" />
      <el-table-column label="操作"
                       fixed="right"
                       width="100">
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row)"
                     type="text"
                     :disabled="scope.row.status!=='已付款'"
                     size="small">发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange"
                   :current-page="tableData.page"
                   :page-size="tableData.length"
                   layout="total, prev, pager, next, jumper"
                   :total="tableData.total"
                   class="dd-mt" />
  </Container>
</template>

<script>
import indexDataMixins from '@/pages/mixins/indexData.js'
export default {
  mixins: [indexDataMixins],
  data () {
    return {
      dataUrl: '/order/paginate'
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleData (res) {
      this.tableData.data = res.data.map(e => {
        switch (e.status) {
          case 1:
            e.status = '未付款'
            e.statusType = 'danger'
            break
          case 2:
            e.status = '已付款'
            e.statusType = 'warning'
            break
          case 3:
            e.status = '已发货'
            e.statusType = 'success'
            break
          default:
            e.statusType = 'info'
            break
        }
        return e
      })
      this.tableData.total = res.total
    },
    handleDetail (e) {
      this.$axios.put('/order/delivery', { id: e.id }).then(res => {
        console.log(res)
      }).catch(err => this.$log(err))
    }
  }
}
</script>
