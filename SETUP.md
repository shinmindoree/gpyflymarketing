# 🚀 Google Sheets 연동 설정 가이드

## 1단계: Google Sheets 생성

1. https://sheets.google.com 접속
2. **새 스프레드시트 생성**
3. 이름: "GPUFly 런칭 알림 신청"
4. **첫 번째 행에 헤더 추가**:
   ```
   A1: 타임스탬프
   B1: 이메일
   C1: 회사명
   D1: 플랜
   E1: 도입시점
   F1: 할인옵션
   ```

## 2단계: Google Apps Script 설정

1. 스프레드시트에서 **Extensions** → **Apps Script** 클릭
2. 기본 코드를 모두 삭제하고 아래 코드 붙여넣기:

\`\`\`javascript
function doPost(e) {
  try {
    // 로그 기록
    Logger.log('Received request');
    Logger.log('postData: ' + JSON.stringify(e.postData));
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // JSON 파싱
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      Logger.log('Parse error: ' + parseError);
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Invalid JSON' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // 시트에 데이터 추가
    sheet.appendRow([
      new Date(),
      data.email || '',
      data.company || '',
      data.plan || '',
      data.timeline || '',
      data.discountOption || ''
    ]);
    
    Logger.log('Data saved successfully');
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 테스트용 함수
function testDoPost() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        email: 'test@example.com',
        company: 'Test Company',
        plan: 'Premium',
        timeline: '2026-Q1',
        discountOption: 'notify-20'
      })
    }
  };
  
  const result = doPost(testEvent);
  Logger.log('Test result: ' + result.getContent());
}
\`\`\`

3. **저장** (Ctrl+S 또는 Cmd+S)
4. 프로젝트 이름 입력 (예: "GPUFly Signup Handler")

## 3단계: Apps Script 배포

1. 우측 상단 **Deploy** 버튼 클릭
2. **New deployment** 선택
3. 설정:
   - **Select type**: ⚙️ 아이콘 클릭 → **Web app** 선택
   - **Description**: "GPUFly signup form handler"
   - **Execute as**: Me (본인 계정)
   - **Who has access**: **Anyone** (중요!)
4. **Deploy** 클릭
5. **권한 승인**:
   - "Review permissions" 클릭
   - Google 계정 선택
   - "Advanced" → "Go to [프로젝트 이름] (unsafe)" 클릭
   - "Allow" 클릭
6. **Web app URL 복사** (예: `https://script.google.com/macros/s/AKfycby.../exec`)

## 4단계: 환경변수 설정

1. 프로젝트 루트에 `.env.local` 파일 생성:
   \`\`\`bash
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_COPIED_URL/exec
   \`\`\`

2. 복사한 URL을 위의 `YOUR_COPIED_URL` 부분에 붙여넣기

## 5단계: 테스트

1. 개발 서버 재시작:
   \`\`\`bash
   npm run dev
   \`\`\`

2. http://localhost:3000 접속
3. 런칭 알림 신청 폼 작성 후 제출
4. Google Sheets 확인 → 데이터가 자동으로 추가됨!

## 6단계: Vercel 배포 시 환경변수 설정

Vercel 대시보드에서:
1. **Project Settings** → **Environment Variables**
2. 추가:
   - **Key**: `GOOGLE_SCRIPT_URL`
   - **Value**: (복사한 Web app URL)
   - **Environment**: Production, Preview, Development 모두 체크
3. **Save**
4. 재배포

## ✅ 완료!

이제 사용자가 알림 신청을 하면 Google Sheets에 자동으로 저장됩니다.

## 📊 Google Sheets 활용 팁

### 자동 정렬
- 데이터 → 필터 만들기
- 최신순 정렬: 타임스탬프 열 클릭 → Z→A 정렬

### 이메일 알림 받기
- Tools → Notification rules
- "A user submits a form" 또는 "Any changes are made"
- 본인 이메일로 알림 설정

### 데이터 분석
- 플랜별 신청자 수: `=COUNTIF(D:D, "Premium")`
- 도입 시점별 통계: Pivot table 활용

## 🔧 문제 해결

### "GOOGLE_SCRIPT_URL not configured" 에러
- `.env.local` 파일 확인
- 개발 서버 재시작

### Google Sheets에 데이터가 안 들어감
1. Apps Script 배포 시 "Who has access"를 **Anyone**으로 설정했는지 확인
2. Web app URL이 정확한지 확인 (끝에 `/exec` 있어야 함)
3. Apps Script 실행 로그 확인: Apps Script 에디터 → 왼쪽 "Executions" 메뉴

### CORS 에러
- Apps Script는 자동으로 CORS 처리되므로 문제 없음
- 혹시 에러가 발생하면 Apps Script 재배포

