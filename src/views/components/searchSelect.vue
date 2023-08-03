<template>
  <el-select
    ref="select"
    style="width: 100%;"
    v-model="selected"
    @change="changeFn"
    @focus="focusFn"
    @blur="blurFn"
    :remote-method="remoteMethod"
    :loading="selectLoading"
    :multiple="multiple"
    :disabled="disabled"
    :filterable="filterable"
    :clearable="clearable"
    :placeholder="placeholder"
    reserve-keyword
    remote
  >
    <div
      v-infinite-scroll="getList"
      :infinite-scroll-disabled="options.length >= total"
      infinite-scroll-distance
      infinite-scroll-immediate
    >
      <el-option 
        v-for="item in options"
        :key="item[option]"
        :label="item[label]"
        :value="item[option]"
        :disabled="disabledFn && disabledFn(item[option])"
      >
      </el-option>
      <div class="more_tips" v-if="loading">加载中</div>
      <div class="more_tips" v-if="options.length >= total">没有更多数据了</div>
    </div>
  </el-select>
</template>

<script>
export default {
  name: 'searchSelect',

  props: [
    'value',
    'listFn',
    'label',
    'option',
    'placeholder',
    'multiple',
    'disabled',
    'filterable',
    'watchVal',
    'backArr',
    'clearable',
    'disabledFn',
  ],

  data() {
    return {
      // 加载状态
      selectLoading: true,
      loading: false,
      // 全部选项
      options: [],
      selected: '',
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 是否初始化列表
      isChange: true,
    }
  },

  created() {},

  watch: {
    // 依赖值发生变化，则重置 v-model 绑定值和列表
    watchVal() {
      this.isChange = true
      this.$emit('input', null)
    },
    // 数据回显
    backArr: {
      immediate: true,
      handler() {
        if(this.backArr) {
          this.options = this.backArr.filter(item => item[this.option])
          this.selected = this.backArr[0] && this.backArr[0][this.option] || null
          this.$emit('input', this.selected || null)
          this.isChange = true
        }
      },
    },
    // 同步父组件 v-model 绑定值
    value() {
      this.selected = this.value
    },
    // 路由页变化后，重置列表，防止在该列表数据被增删时，由于路由缓存导致页面数据不即时
    $route() {
      this.isChange = true
    }
  },

  methods: {
    // 获取焦点时，重置查询参数，并请求列表
    async focusFn() {
      if (this.isChange) {
        // 解决关键词为空、数据为空时不提示无数据问题（利用饿了么逻辑漏洞）
        await this.$nextTick()
        this.$refs.select.query = ' '
        this.queryParams[this.label] = ''
        this.queryParams.pageNum = 1
        this.options = []
        this.getList()
        this.isChange = false
      }
    },
    // 获取选项列表
    async getList() {
      if (this.loading) return
      this.loading = true
      const { rows, total } = await this.listFn(this.queryParams)

      // 去重, 避免回显数据与请求数据重复
      const map = new Map()
      this.options = [...this.options, ...rows]
        .filter(v => !map.has(v[this.option]) && map.set(v[this.option], 1))

      this.loading = false
      this.selectLoading = false
      this.total = total
      this.queryParams.pageNum++
    },
    // 根据传入的 label 字段进行模糊搜索
    remoteMethod(query) {
      this.options = []
      this.queryParams.pageNum = 1
      this.queryParams[this.label] = query
      this.getList()
    },
    // 选择框选项发生变化时触发
    changeFn() {
      const row = this.options.find(item => item[this.option] === this.selected) || {}
      // 将组件选中值同步给父组件 v-model 绑定值
      this.$emit('input', this.selected)
      // 选中值发生变化时, 将选中数据所在的对象传给父组件
      this.$emit('change', row)
    },
    // 失去焦点时，搜索关键字会被清空，需要重置列表，保证列表数据和搜索关键字匹配
    blurFn() {
      this.isChange = true
    }
  },
}
</script>

<style scoped>
.more_tips {
  padding: 5px 0;
  margin: 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>