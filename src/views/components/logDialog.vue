<template>
  <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="1300px" :modal-append-to-body="false">
    <el-table
      v-loading="loading"
      :data="tableList"
      :height="height"
      size="mini"
      border
    >
      <el-table-column
        v-for="column in columns"
        :key="column.label"
        :label="column.label"
        :prop="column.prop"
        :show-overflow-tooltip="column.showTip"
        :width="column.width"
        align="center"
      >
        <template slot-scope="scope">
          <dict-tag v-if="column.dict" :options="dict.type[column.dict]" :value="scope.row[column.prop]" />
          <file-upload v-if="column.isUpload" :value="scope.row[column.prop]" :showBtn="false" />
          <div class="ellipsis" v-if="!column.dict && !column.isUpload">{{ scope.row[column.prop] }}</div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
export default {
  name: 'logDialog',

  props: [
    'title',
    'height',
    'columns',
    'listFn',
    'dict',
  ],

  data() {
    return {
      open: false,
      loading: false,
      total: 0,
      tableList: [],
      queryParams: {},
    }
  },

  created() {},

  methods: {
    openFn(params) {
      this.open = true

      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      }

      for(let k in params) {
        this.queryParams[k] = params[k]
      }

      this.getList()
    },
    async getList() {
      this.loading = true

      const { rows, total } = await this.listFn(this.queryParams)
      this.tableList = rows
      this.total = total

      this.loading = false
    }
  },
}
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
