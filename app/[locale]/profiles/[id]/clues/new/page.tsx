import {ClueNewH5Page} from '@/components/pages/clue-new/h5'
import {ClueNewPcPage} from '@/components/pages/clue-new/pc'
import {getProfileDetail} from '@/lib/repository'

export default async function NewCluePage({params}: {params: {locale: string; id: string}}) {
  const detail = await getProfileDetail(params.id)
  const prefix = params.locale === 'en' ? '/en' : ''
  const profile = detail?.profile
  const clue = detail?.clues[0]
  const parsed = clue?.parsedResult?.length ? clue.parsedResult : fallbackParsed
  const content = clue?.content ?? '刚收到年终奖8万元，打算拿出4万元投资指数基金，另外信用卡还了7000元。'

  return (
    <main className="min-h-screen bg-[#f7faff]">
      <ClueNewPcPage prefix={prefix} profileId={params.id} parsed={parsed} content={content} />
      <ClueNewH5Page prefix={prefix} profileId={params.id} profile={profile} parsed={parsed} content={content} />
    </main>
  )
}

const fallbackParsed = [
  {type: 'income', item: '年终奖收入', amount: 80000, amountText: '80,000元', confidence: 'high' as const, explanation: '识别依据：年终奖8万元', impacts: []},
  {type: 'asset', item: '投资指数基金', amount: 40000, amountText: '40,000元', confidence: 'medium' as const, explanation: '识别依据：拿出4万元投资指数基金', impacts: []},
  {type: 'debt', item: '信用卡还款', amount: 7000, amountText: '7,000元', confidence: 'medium' as const, explanation: '识别依据：信用卡还了7000元', impacts: []}
]
