export const dateInRange = (start_date: number, end_date: number): boolean => {
  const now_date = Date.now()
  return now_date >= start_date && now_date <= end_date
}
