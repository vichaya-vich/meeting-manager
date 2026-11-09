export const truncateToMinute = (date: Date) => {
  const result = new Date(date)
  result.setSeconds(0, 0)
  return result
}
