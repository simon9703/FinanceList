export function simpleId(prefix = 'id') {
  return `${prefix}-${Date.now()}`
}
