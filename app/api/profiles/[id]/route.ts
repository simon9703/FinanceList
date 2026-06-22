import {NextResponse} from 'next/server'

export function GET() {
  return NextResponse.json({error: 'Legacy endpoint removed. Use scenario APIs.'}, {status: 410})
}

export function POST() {
  return NextResponse.json({error: 'Legacy endpoint removed. Use scenario APIs.'}, {status: 410})
}
