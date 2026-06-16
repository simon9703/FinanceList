import {NextResponse} from 'next/server'
import {getProfileDetail} from '@/lib/repository'

export async function GET(_request: Request, {params}: {params: {id: string}}) {
  const data = await getProfileDetail(params.id)
  if (!data) return NextResponse.json({error: 'Not found'}, {status: 404})
  return NextResponse.json({data})
}
