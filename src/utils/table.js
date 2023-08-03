// el-table 相关的公用方法
/**
 * el-table 单行 className 设置方法
 * @param {Array} arrObj 包含 { flag, className } 格式对象的数组
 ** @param {Boolean} flag 是否添加类名
 ** @param {String} className 要添加的类名
 * @return {String} className
 * @import import { tableRowClassName } from '@/utils/table'
 * @example :row-class-name="({ row }) => tableRowClassName([{ flag: true, className: 'uncheck_row' }])"
 */
// 
export const tableRowClassName = (arrObj) => {
  let className = ''
  arrObj.forEach(item => {
    if (item.flag) className = item.className
  })
  return className
}

/**
 * el-table 合计栏自定义方法
 * @param {$event} $event el-table 的传参
 * @param {Array} arr 包含所有要合计的列索引
 * @param {String} str 合计行第一列展示的名称，默认为'合计'
 * @param {Number} num 合计行名称展示列索引，默认为 0
 * @return {Array} 合计行展示的数据
 * @import import { getSummaries } from '@/utils/table'
 * @example show-summary :summary-method="$event => getSummaries($event, [6])"
 */
export const getSummaries = ({ columns, data }, arr, str, num) => {
  const sums = []
  const number = num || 0
  columns.forEach((column, index) => {
    if (index === number) {
      sums[index] = str || '合计'
    } else if (arr.includes(index)) {
      const values = data.map(item => Number(item[column.property]))

      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
    } else {
      sums[index] = ''
    }
  })
  // 如果是小数则保留两位小数
  return sums.map(item => Number(item) ? (Number(item) === Math.round(item) ? item : item.toFixed(2)) : item)
}
