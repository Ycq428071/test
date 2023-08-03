<template>
  <el-dialog v-dialogDrag :title="title" :visible.sync="open" :width="width" :modal-append-to-body="false" class="detail_dialog">
    <el-row :gutter="15">
      <el-form ref="elForm" size="mini" :label-width="labelWidth">
        <el-col v-for="item in config" :key="item.value" :span="+span">
          <el-form-item :label="item.label">
            <file-upload v-if="item.isUpload && dictFn(item)" :value="dictFn(item)" :showBtn="false" />
            <el-input v-else :value="dictFn(item)" readonly :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'detailDialog',

  props: [
    'title',
    'width',
    'labelWidth',
    'span',
    'config',
    'detail',
    'dict',
  ],
  data() {
    return {
      open: false,
    }
  },

  methods: {
    openFn() {
      this.open = true
    },
    dictFn(item) {
      const dict = this.dict?.type[item.dict]
      const obj = dict && dict.find(ele => ele.value == this.detail[item.value])
      return item.dict
        ? obj && obj.label
        : this.detail[item.value]
    }
  },
}
</script>

<style>
@media screen and (max-width: 1000px) {
  .detail_dialog .el-dialog {
    width: 80vw !important;
  }
}
</style>
