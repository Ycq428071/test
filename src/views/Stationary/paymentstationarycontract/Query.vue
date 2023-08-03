<template>
  <div>
    <el-button type="primary">新增</el-button>
    <el-table :data="list">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="name" label="签"></el-table-column>
      <el-table-column prop="name" label="单位名称"></el-table-column>
      <el-table-column prop="name" label="发票号"></el-table-column>
      <el-table-column prop="name" label="开票日期"></el-table-column>
      <el-table-column prop="name" label="发票金额"></el-table-column>
      <el-table-column prop="name" label="收费期"></el-table-column>
      <el-table-column prop="name" label="收费期"></el-table-column>
      <el-table-column prop="name" label="开票人"></el-table-column>
      <el-table-column prop="name" label="已收款"></el-table-column>
      <el-table-column prop="name" label="未收款"></el-table-column>
      <el-table-column prop="name" label="所属驻点"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <!-- <el-button type="primary">主要按钮</el-button> -->
        <el-link style="margin-right: 10px;" type="warning">修改</el-link>
        <el-link type="danger">删除</el-link>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { name: 'aa' }
      ]
    }
  }
}
</script>

<style></style>