export function money(value: number, compact = false) {
  if (compact && Math.abs(value) >= 10000) {
    return `¥${Math.round(value / 10000).toLocaleString('zh-CN')}万`
  }
  return `¥${Math.round(value).toLocaleString('zh-CN')}`
}

export function percent(value: number, digits = value < 0.1 ? 1 : 0) {
  return `${(value * 100).toFixed(digits)}%`
}

export function signedMoney(value: number) {
  const prefix = value >= 0 ? '+' : '-'
  return `${prefix}${money(Math.abs(value), true)}`
}
