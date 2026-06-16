import {NextResponse} from 'next/server'
import {createClue} from '@/lib/repository'

export async function POST(request: Request) {
  const body = await request.json()
  try {
    const data = await createClue({
      profileId: body.profileId,
      content: body.content ?? '',
      parsedResult: body.parsedResult
    })

    return NextResponse.json({data}, {status: 201})
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }
    throw error
  }
}
