export function yuan(value: number) {
  return `¥${value.toLocaleString('zh-CN', {maximumFractionDigits: 0})}`
}

export function shortYuan(value: number) {
  if (Math.abs(value) >= 10000) {
    return `¥${(value / 10000).toLocaleString('zh-CN', {maximumFractionDigits: 1})}万`
  }
  return yuan(value)
}

export function percent(value: number) {
  return `${Math.round(value)}%`
}
