"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SimpleSelect, SimpleSelectItem } from "@/components/ui/simple-select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Mail, Shield, Zap, Cloud, Rocket, Shuffle, AlertTriangle, Tags, Settings, MousePointerClick, ChevronRight } from "lucide-react"

export default function LaunchPage() {
  // solution preview images (files under public/ are served from root path)
  const multicloudImg = "/card1.png" // 멀티클라우드 비교
  const clickToLaunchImg = "/card2.png" // 클릭 투 런치
  const smartAltImg = "/card3.png" // 스마트 대체 추천 (미정: 추후 교체)
  const manageImg = "/card4.png" // 멀티클라우드 실행/관리 (플레이스홀더)

  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [plan, setPlan] = useState("Premium")
  const [timeline, setTimeline] = useState("2026-Q1")
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [solutionPreview, setSolutionPreview] = useState<{ title: string; src: string }>({ title: '멀티클라우드 비교', src: multicloudImg })
  const [discountOption, setDiscountOption] = useState<'notify-20' | 'prepay-50'>('notify-20')

  const submitWith = async (option: 'notify-20' | 'prepay-50') => {
    if (!agree || !email) {
      setError("이메일과 수신 동의를 확인해주세요.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/launch/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, plan, timeline, agree, discountOption: option })
      })
      if (!res.ok) throw new Error("submit failed")
      setDone(true)
    } catch (e) {
      setError("제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => submitWith(discountOption)

  return (
    <div className="mx-auto p-6 min-h-screen max-w-[1280px]">
      <div className="space-y-10 md:space-y-14">
        {/* Top brand */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <img src="/gpufly-logo.png" alt="GPUFly" className="h-20 w-auto"/>
            <span className="text-5xl font-semibold tracking-tight">GPUFly</span>
          </div>
        </div>
        {/* Hero */}
        <section className="text-center space-y-5">
          <Badge className="bg-blue-100 text-blue-800">Launching Soon</Badge>
          <h1 className="font-bold tracking-tight text-4xl md:text-6xl leading-tight">
            <span className="block">Find the right GPU, launch Now</span>
        
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            모든 Cloud GPU 가격·가용성을 한 화면에서 비교하고, 클릭 한 번으로 GPU를 실행하세요.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="lg" onClick={()=>document.getElementById('signup')?.scrollIntoView({behavior:'smooth'})}>서비스 사전 신청하기</Button>
            <Button variant="outline" size="lg" onClick={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>어떤 서비스인가요?</Button>
          </div>
        </section>

        

        {/* Pain points */}
        <section id="pains" className="rounded-2xl bg-gray-50">
          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">스타트업의 Cloud GPU 활용시 겪는 어려움</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              <Card className="h-full bg-white text-foreground ring-1 ring-black/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50">
                      <AlertTriangle className="w-4 h-4 text-amber-600"/>
                    </span>
                    <CardTitle className="text-base">온디맨드 고사양 GPU 인스턴스 부족</CardTitle>
                  </div>
                  <CardDescription>H100/A100 등 고성능 GPU의 온디맨드 수급 불안정</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc ml-4 space-y-1">
                    <li>H100, A100 등 AI개발/운영에 필요한 고성능 GPU 부족</li>
                    <li>AWS, Azure, GCP 등 주요 CSP에서도 온디맨드 제공이 어려움</li>
                    <li>결국 다른 GPUaaS 프로바이더별로 또 찾아봐야 하는 번거로움</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="h-full bg-white text-foreground ring-1 ring-black/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                      <Tags className="w-4 h-4 text-indigo-600"/>
                    </span>
                    <CardTitle className="text-base">여러 GPUaaS 업체 비교의 번거로움</CardTitle>
                  </div>
                  <CardDescription>요금·스펙 체계가 제각각, 비교 피로도 증가</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc ml-4 space-y-1">
                    <li>GPUaaS 업체별 요금/스펙 체계가 제각각</li>
                    <li>AWS/Azure/GCP뿐 아니라 다수의 중소 GPUaaS 업체까지 포괄</li>
                    <li>모델·리전별로 딱 맞는 Cloud GPU 찾기가 지나치게 번거로움</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="h-full bg-white text-foreground ring-1 ring-black/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50">
                      <Settings className="w-4 h-4 text-slate-600"/>
                    </span>
                    <CardTitle className="text-base">설정·런칭의 복잡함</CardTitle>
                  </div>
                  <CardDescription>템플릿/OS/환경이 제각각, 셋업 비용 증가</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc ml-4 space-y-1">
                    <li>GPUaaS별 서버 런칭 템플릿이 제각각</li>
                    <li>OS·개발환경 등 설정이 복잡</li>
                    <li>가용 GPU가 있는 곳으로 빠르게 이동해야 하는 스타트업에 시간 낭비</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features band */}
        <section id="features" className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
          <div className="px-6 py-10 md:px-10 md:py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">GPU 브로커리지가 문제를 이렇게 해결합니다</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
              <Card role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){setSolutionPreview({ title: '멀티클라우드 비교', src: multicloudImg })}}} className="w-full h-full bg-white text-foreground ring-1 ring-black/5 hover:shadow-lg hover:-translate-y-[2px] focus:ring-2 focus:ring-indigo-500 transition cursor-pointer" onClick={() => setSolutionPreview({ title: '멀티클라우드 비교', src: multicloudImg })}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                      <Cloud className="w-4 h-4 text-indigo-600"/>
                    </span>
                    <CardTitle className="text-base">멀티클라우드 비교</CardTitle>
                  </div>
                  <CardDescription>AWS · Azure · GCP 및 기타 GPUaaS 까지 한 곳에서 비교</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  여러 CSP에서 제공하는 주요 GPU 모델의 가격·사양·가용성을 즉시 비교합니다.
                  <div className="mt-3 flex items-center text-indigo-600 font-medium text-xs">
                    <MousePointerClick className="w-3 h-3 mr-1"/> 클릭 <ChevronRight className="w-3 h-3 ml-1"/>
                  </div>
                </CardContent>
              </Card>
              <Card role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){setSolutionPreview({ title: '클릭 투 런치', src: clickToLaunchImg })}}} className="w-full h-full bg-white text-foreground ring-1 ring-black/5 hover:shadow-lg hover:-translate-y-[2px] focus:ring-2 focus:ring-indigo-500 transition cursor-pointer" onClick={() => setSolutionPreview({ title: '클릭 투 런치', src: clickToLaunchImg })}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                      <Rocket className="w-4 h-4 text-indigo-600"/>
                    </span>
                    <CardTitle className="text-base">클릭 투 런치</CardTitle>
                  </div>
                  <CardDescription>AI개발 환경을 위한 컨테이너 이미지 기반 즉시 런칭</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  사용자 지정 도커이미지를 통해 여러 CSP에서 즉시 개발환경을 실행합니다.
                  <div className="mt-3 flex items-center text-indigo-600 font-medium text-xs">
                    <MousePointerClick className="w-3 h-3 mr-1"/> 클릭 <ChevronRight className="w-3 h-3 ml-1"/>
                  </div>
                </CardContent>
              </Card>
              <Card role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){setSolutionPreview({ title: '가용한 대체 GPU 자동 추천 및 추후 가용 시 실시간 알림 기능', src: smartAltImg })}}} className="w-full h-full bg-white text-foreground ring-1 ring-black/5 hover:shadow-lg hover:-translate-y-[2px] focus:ring-2 focus:ring-indigo-500 transition cursor-pointer" onClick={() => setSolutionPreview({ title: '대체 GPU 자동 추천 및 알림 기능', src: smartAltImg })}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                      <Shuffle className="w-4 h-4 text-indigo-600"/>
                    </span>
                    <CardTitle className="text-base">대체 GPU 자동 추천</CardTitle>
                  </div>
                  <CardDescription>대체 리전·GPU Moodel 자동 제안</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  원하는 GPU의 가용성 부족 시 인접 리전/유사 스펙을 자동 추천하고 가격 변동을 알립니다.
                  <div className="mt-3 flex items-center text-indigo-600 font-medium text-xs">
                    <MousePointerClick className="w-3 h-3 mr-1"/> 클릭 <ChevronRight className="w-3 h-3 ml-1"/>
                  </div>
                </CardContent>
              </Card>
              <Card role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){setSolutionPreview({ title: 'Multi Cloud의 GPU를 한 곳에서 실행하고 관리', src: manageImg })}}} className="w-full h-full bg-white text-foreground ring-1 ring-black/5 hover:shadow-lg hover:-translate-y-[2px] focus:ring-2 focus:ring-indigo-500 transition cursor-pointer" onClick={() => setSolutionPreview({ title: 'Multi Cloud의 GPU를 한 곳에서 실행하고 관리', src: manageImg })}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                      <Shield className="w-4 h-4 text-indigo-600"/>
                    </span>
                    <CardTitle className="text-base">Multi Cloud의 GPU를 한 곳에서 실행하고 관리</CardTitle>
                  </div>
                  <CardDescription>대시보드에서 통합 실행/모니터링</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  여러 CSP의 GPU 서버를 단일 콘솔에서 실행하고 상태를 모니터링합니다.
                  <div className="mt-3 flex items-center text-indigo-600 font-medium text-xs">
                    <MousePointerClick className="w-3 h-3 mr-1"/> 클릭 <ChevronRight className="w-3 h-3 ml-1"/>
                  </div>
                </CardContent>
              </Card>
              {/* Preview area inside section */}
              <div className="md:col-span-4">
                <div className="mt-6 rounded-xl overflow-hidden bg-white/90 ring-1 ring-black/5">
                  <div className="px-4 py-3 border-b">
                    <h3 className="text-sm font-medium text-muted-foreground">{solutionPreview.title}</h3>
                  </div>
                  <div className="p-4">
                    <img src={solutionPreview.src} alt={solutionPreview.title} className="w-full h-auto rounded-md border" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/window.svg'}}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

    

        {/* Pricing intent */}
        <Card id="signup">
          <CardHeader>
            <CardTitle>서비스 요금제(월 구독)</CardTitle>
            <CardDescription>사전 알림 신청고객에 한하여, 출시 시점에 얼리버드 혜택(월 20% 할인)을 제공합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Free</CardTitle>
                  <CardDescription>무료</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div>
                    <div className="font-medium text-foreground mb-1">서비스</div>
                    <ul className="list-disc ml-4">
                      <li>Multi Cloud GPU 가격,스펙,가용성 실시간 확인</li>
                    </ul><br></br>
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">핵심 가치</div>
                    <p>여러 Cloud GPU 프로바이더를 일일이 검색할 필요없이 한 곳에서 손쉽게 가격, 스펙, 가용성을 비교할 수 있습니다.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Premium</CardTitle>
                  <CardDescription>$100 /월</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div>
                    <div className="font-medium text-foreground mb-1">서비스</div>
                    <ul className="list-disc ml-4">
                      <li>Multi Cloud GPU 가격,스펙,가용성 실시간 확인</li>
                      <li>GPU서버 즉시 런칭</li>
                    </ul><br></br>
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">핵심 가치</div>
                    <p>GPU 서버를 직접 활용하고자 하는 사용자를 위한 핵심 기능으로, Multi Cloud GPU를 단일 플랫폼에서 손쉽게 런칭할 수 있습니다.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Enterprise</CardTitle>
                  <CardDescription>$500 /월</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div>
                    <div className="font-medium text-foreground mb-1">서비스</div>
                    <ul className="list-disc ml-4">
                      <li>Multi Cloud GPU 가격,스펙,가용성 실시간 확인</li>
                      <li>GPU서버 즉시 런칭</li>
                      <li>AI 워크로드 관련 클라우드 자원 통합 관리(서버/DB/스토리지 등)</li>
                    </ul><br></br>
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">핵심 가치</div>
                    <p>대규모 프로젝트 또는 복합 클라우드 환경을 운영하는 기업 고객에게 적합한 맞춤형 모델로, 모든 클라우드 자원을 하나의 플랫폼에서 통합 관리하여 운영 효율을 극대화합니다.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Signup form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Mail className="w-4 h-4 mr-2"/>런칭 알림 신청(12월말 출시 예정)</CardTitle>
          </CardHeader>
          <CardContent>
            {done ? (
              <div className="flex flex-col items-center py-8">
                <CheckCircle className="w-8 h-8 text-green-600 mb-2"/>
                <div className="text-green-700 font-medium">신청이 접수되었습니다. 이메일을 확인해주세요.</div>
                <Button asChild variant="outline" className="mt-4"><Link href="/">홈으로</Link></Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-2 rounded-md bg-amber-50 text-amber-900 border border-amber-200 px-3 py-2">
                  <Zap className="w-4 h-4 text-amber-600"/>
                  <span className="text-sm font-medium">알림 신청만 해도 서비스 런칭 시 비용 20% 할인 받을 수 있습니다.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">이메일</label>
                  <Input placeholder="you@company.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium">회사명 (선택)</label>
                    <Input placeholder="회사명 (선택)" value={company} onChange={(e)=>setCompany(e.target.value)} />
                  </div>
                <div className="md:col-span-1">
                  <label className="text-sm font-medium">플랜</label>
                  <SimpleSelect value={plan} onValueChange={setPlan}>
                    <SimpleSelectItem value="Free">Free</SimpleSelectItem>
                    <SimpleSelectItem value="Premium">Premium</SimpleSelectItem>
                    <SimpleSelectItem value="Enterprise">Enterprise</SimpleSelectItem>
                  </SimpleSelect>
                </div>
                <div className="md:col-span-1">
                    <label className="text-sm font-medium">도입 시점 (2026)</label>
                    <SimpleSelect value={timeline} onValueChange={setTimeline}>
                      <SimpleSelectItem value="2026-Q1">2026년 1분기</SimpleSelectItem>
                      <SimpleSelectItem value="2026-Q2">2026년 2분기</SimpleSelectItem>
                      <SimpleSelectItem value="2026-Q3">2026년 3분기</SimpleSelectItem>
                      <SimpleSelectItem value="2026-Q4">2026년 4분기</SimpleSelectItem>
                    </SimpleSelect>
                </div>
                <div className="md:col-span-1 flex items-end gap-2">
                  <Button onClick={submit} disabled={loading || !email || !agree} className="w-full">
                    {loading ? "전송 중..." : "서비스 알림 신청(클릭)"}
                  </Button>
                  {/* <Button variant="secondary" onClick={()=>submitWith('prepay-50')} disabled={loading || !email || !agree} className="w-full">
                    {loading ? "전송 중..." : "사전 결제 신청 (50% 할인)"}
                  </Button> */}
                </div>
                <div className="md:col-span-6 flex items-center gap-2">
                  <input type="checkbox" className="rounded" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
                  <span className="text-sm text-muted-foreground">광고성 정보 수신에 동의합니다. 언제든 구독 해지할 수 있어요.</span>
                </div>
                
                {error && <div className="md:col-span-6 text-sm text-red-600">{error}</div>}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <Shield className="w-3 h-3"/> 개인정보는 출시 알림 및 관련 안내 외 목적으로 사용되지 않습니다.
        </div>

        {/* Trust */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2">
          <span>지원 예정:</span>
          <Badge variant="outline">AWS</Badge>
          <Badge variant="outline">Azure</Badge>
          <Badge variant="outline">GCP</Badge>
          <Badge variant="outline">Runpod</Badge>
          <Badge variant="outline">Lambda labs</Badge>
          <Badge variant="outline">Vast.ai</Badge>
          <Badge variant="outline">Paperspace</Badge>
          <Badge variant="outline">CoreWeave</Badge>
          <Badge variant="outline">KT Cloud</Badge>
          <Badge variant="outline">Naver Cloud</Badge>
          <Badge variant="outline">Elice Cloud</Badge>
        </div>

        {/* Bottom brand + copyright */}
        <div className="mt-8 pt-6 border-t flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <img src="/gpufly-logo.png" alt="GPUFly" className="h-8 w-auto opacity-90"/>
            <span className="text-sm font-semibold">GPUFly</span>
          </div>
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} GPUFly. All rights reserved.</div>
        </div>
      </div>
    </div>
  )
}

