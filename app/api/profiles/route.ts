import {NextResponse} from 'next/server'
import {createProfile, listProfiles} from '@/lib/repository'

export async function GET() {
  const data = await listProfiles()
  return NextResponse.json({data})
}

export async function POST(request: Request) {
  const body = await request.json()
  try {
    const data = await createProfile({
      id: body.id,
      name: body.name,
      ageRange: body.ageRange,
      city: body.city,
      job: body.job,
      maritalStatus: body.maritalStatus,
      children: body.children,
      totalAsset: body.totalAsset ?? body.asset,
      totalDebt: body.totalDebt ?? body.debt,
      monthlyIncome: body.monthlyIncome ?? body.income,
      monthlyExpense: body.monthlyExpense ?? body.expense,
      confidence: body.confidence
    })

    return NextResponse.json({data}, {status: 201})
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }
    throw error
  }
}
