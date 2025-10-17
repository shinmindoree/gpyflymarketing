import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // TODO: 실제 클라우드 API 연동. 현재는 요청 유효성만 가볍게 확인.
    if (!body?.provider || !body?.region || !body?.instance) {
      return NextResponse.json({ success: false, error: 'invalid-params' }, { status: 400 })
    }

    // 모의 배포 응답
    return NextResponse.json({ success: true, jobId: `job_${Date.now()}`, received: body })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'unexpected' }, { status: 500 })
  }
}

