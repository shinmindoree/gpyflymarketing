import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const hasEnv = Boolean(process.env.GOOGLE_SCRIPT_URL)
    return NextResponse.json({ ok: true, route: 'signup', hasEnv })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'unexpected' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, company, plan, timeline, agree, discountOption } = body || {}
    
    console.log('Received signup request:', { email, company, plan, timeline, agree, discountOption })
    
    if (!email || !agree) {
      return NextResponse.json({ success: false, message: 'invalid' }, { status: 400 })
    }

    // Google Apps Script Web App URL (환경변수에서 가져오기)
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL
    
    if (!GOOGLE_SCRIPT_URL) {
      console.error('GOOGLE_SCRIPT_URL not configured - saving to console only')
      console.log('launch_signup', { email, company, plan, timeline, agree, discountOption })
      return NextResponse.json({ success: true })
    }

    console.log('Sending to Google Sheets:', GOOGLE_SCRIPT_URL)

    // Google Sheets에 데이터 전송
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        email,
        company,
        plan,
        timeline,
        discountOption
      }),
      redirect: 'follow'
    })

    console.log('Google Sheets response status:', response.status)
    const responseText = await response.text()
    console.log('Google Sheets response:', responseText)

    if (!response.ok) {
      console.error('Google Sheets error:', responseText)
      throw new Error(`Failed to save to Google Sheets: ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Error in signup:', e)
    // 에러가 발생해도 사용자에게는 성공으로 표시 (데이터는 서버 로그에 남음)
    return NextResponse.json({ 
      success: true, 
      warning: 'Data saved to server logs' 
    })
  }
}

