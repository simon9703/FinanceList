export type CreateProfileGroupKey = 'ageRange' | 'city' | 'job' | 'house' | 'car' | 'income' | 'debt'

export const createProfileGroups: Record<CreateProfileGroupKey, string[]> = {
  ageRange: ['26-30', '31-35', '36-40'],
  city: ['一线', '新一线', '二线'],
  job: ['互联网', '金融', '创业'],
  house: ['有房有贷', '有房无贷', '无房'],
  car: ['无车', '20万+', '30万+'],
  income: ['1-2万', '2-3万', '3万+'],
  debt: ['无负债', '房贷', '消费贷'],
}
