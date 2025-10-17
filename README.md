# GPUFly Launch Marketing Page

GPUFly 서비스의 마케팅/런칭 페이지입니다.

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📦 프로젝트 구조

```
gpuflymarketing/
├── public/                    # 정적 이미지 파일
│   ├── gpufly-logo.png       # 로고
│   └── card1-4.png           # 기능 미리보기 이미지
├── src/
│   ├── app/
│   │   ├── page.tsx          # 메인 런칭 페이지
│   │   ├── run/page.tsx      # GPU 런치 데모 페이지
│   │   └── api/launch/       # API 엔드포인트 (signup, deploy)
│   ├── components/ui/        # UI 컴포넌트
│   └── lib/utils.ts          # 유틸리티 함수
└── package.json
```

## 🌐 배포

### Vercel 배포

1. GitHub에 리포지토리 푸시
2. [Vercel](https://vercel.com)에서 Import
3. 프로젝트 설정 후 Deploy

### 환경변수

현재 환경변수 불필요 (API 라우트는 mock)

## 📧 이메일 수집

현재 `/api/launch/signup`는 콘솔에만 로그를 출력합니다.  
실제 이메일 수집을 위해서는:

- Google Sheets API
- Mailchimp
- SendGrid 
- Resend

등의 서비스와 연동하세요.

## 📝 라이선스

© 2025 GPUFly. All rights reserved.

