"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SimpleSelect, SimpleSelectItem } from "@/components/ui/simple-select"
import { Rocket, Plus, Trash2 } from "lucide-react"

type DeployState = "idle" | "submitting" | "success" | "error"

export function LaunchRunPage() {
  const router = useRouter()
  const params = useSearchParams()

  const provider = params.get("provider") || "AWS"
  const region = params.get("region") || "us-east-1"
  const instance = params.get("instance") || "p4d.24xlarge"
  const gpuModel = params.get("gpuModel") || "A100"
  const gpuCount = Number(params.get("gpuCount") || "1")
  const pricePerHour = Number(params.get("pricePerHour") || "0")
  const pricePerGpu = Number(params.get("pricePerGpu") || "0")
  const currency = params.get("currency") || "USD"

  const [machineName, setMachineName] = useState(`${gpuModel.toLowerCase()}-machine`)
  const [selectedRegion, setSelectedRegion] = useState(region)
  const [osImage, setOsImage] = useState("Ubuntu 22.04 + CUDA 12.2 ML")
  const [sshKey, setSshKey] = useState("Managed Key")
  const [tags, setTags] = useState("")
  const [template, setTemplate] = useState("PyTorch 2.4 + CUDA 12.1")
  const [containerEnabled, setContainerEnabled] = useState(true)
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>([
    { key: "HF_HOME", value: "/workspace/.cache/huggingface" },
    { key: "TORCH_CUDA_ARCH_LIST", value: "8.0;9.0" }
  ])
  const [autoVolume, setAutoVolume] = useState(true)
  const [startupScript, setStartupScript] = useState("#!/bin/bash\napt update -y && apt install -y git\n# project bootstrap here")
  const [state, setState] = useState<DeployState>("idle")
  const [error, setError] = useState<string | null>(null)

  const totalCost = useMemo(() => {
    return pricePerHour || pricePerGpu * Math.max(1, gpuCount)
  }, [pricePerHour, pricePerGpu, gpuCount])

  const addEnv = () => setEnvVars([...envVars, { key: "", value: "" }])
  const removeEnv = (idx: number) => setEnvVars(envVars.filter((_, i) => i !== idx))
  const updateEnv = (idx: number, field: "key" | "value", val: string) => {
    const next = envVars.slice()
    next[idx] = { ...next[idx], [field]: val }
    setEnvVars(next)
  }

  const handleDeploy = async () => {
    setState("submitting")
    setError(null)
    try {
      const res = await fetch("/api/launch/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          region: selectedRegion,
          instance,
          gpuModel,
          gpuCount,
          machineName,
          osImage,
          sshKey,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          template,
          containerEnabled,
          env: envVars.filter(v => v.key),
          autoVolume,
          startupScript,
          currency,
          totalCost
        })
      })
      if (!res.ok) throw new Error("failed")
      setState("success")
      // Mock: persist to localStorage and navigate to running list
      try {
        const raw = localStorage.getItem('runningInstances')
        const list = raw ? JSON.parse(raw) : []
        list.push({
          id: `mock_${Date.now()}`,
          provider,
          region: selectedRegion,
          instanceName: instance,
          gpuModel,
          gpuCount,
          pricePerHour,
          currency,
          status: 'running',
          startedAt: new Date().toISOString(),
          machineName,
          template,
        })
        localStorage.setItem('runningInstances', JSON.stringify(list))
      } catch {}
      router.push('/running-instances')
    } catch (e) {
      setState("error")
      setError("배포 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    }
  }

  useEffect(() => {
    setSelectedRegion(region)
  }, [region])

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex-1 w-full space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Launch</CardTitle>
              <CardDescription>AI 개발에 최적화된 템플릿으로 즉시 실행하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Machine Name</label>
                  <Input value={machineName} onChange={(e)=>setMachineName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <SimpleSelect value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SimpleSelectItem value={region}>{region}</SimpleSelectItem>
                    <SimpleSelectItem value="us-west-2">us-west-2</SimpleSelectItem>
                    <SimpleSelectItem value="asia-northeast3">asia-northeast3</SimpleSelectItem>
                  </SimpleSelect>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Operating System</label>
                  <SimpleSelect value={osImage} onValueChange={setOsImage}>
                    <SimpleSelectItem value="Ubuntu 22.04 + CUDA 12.2 ML">Ubuntu 22.04 + CUDA 12.2 ML</SimpleSelectItem>
                    <SimpleSelectItem value="Ubuntu 22.04 + CUDA 12.1 ML">Ubuntu 22.04 + CUDA 12.1 ML</SimpleSelectItem>
                    <SimpleSelectItem value="Ubuntu 20.04 (bare)">Ubuntu 20.04 (bare)</SimpleSelectItem>
                  </SimpleSelect>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SSH key</label>
                  <SimpleSelect value={sshKey} onValueChange={setSshKey}>
                    <SimpleSelectItem value="Managed Key">Shadeform Managed Key</SimpleSelectItem>
                    <SimpleSelectItem value="Upload">Bring your own key</SimpleSelectItem>
                  </SimpleSelect>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Instance Tags</label>
                  <Input placeholder="Enter tags... (comma separated)" value={tags} onChange={(e)=>setTags(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <SimpleSelect value={template} onValueChange={setTemplate}>
                  <SimpleSelectItem value="PyTorch 2.4 + CUDA 12.1">PyTorch 2.4 + CUDA 12.1</SimpleSelectItem>
                  <SimpleSelectItem value="TensorFlow 2.16 + CUDA 12.2">TensorFlow 2.16 + CUDA 12.2</SimpleSelectItem>
                  <SimpleSelectItem value="NVIDIA CUDA 12.2 Base">NVIDIA CUDA 12.2 Base</SimpleSelectItem>
                  <SimpleSelectItem value="llama.cpp runtime">llama.cpp runtime</SimpleSelectItem>
                </SimpleSelect>
              </div>

              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">Container-on-Instance Configuration</div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" checked={containerEnabled} onChange={(e)=>setContainerEnabled(e.target.checked)} />
                    <span>{containerEnabled ? "On" : "Off"}</span>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">GPU 컨테이너를 자동 구성하여 인스턴스 부팅 시 개발 환경이 준비됩니다.</p>
              </div>

              <div>
                <div className="font-medium text-sm mb-2">Environment Variables</div>
                <div className="space-y-2">
                  {envVars.map((env, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2">
                      <Input className="col-span-2" placeholder="KEY" value={env.key} onChange={(e)=>updateEnv(idx, "key", e.target.value)} />
                      <Input className="col-span-3" placeholder="VALUE" value={env.value} onChange={(e)=>updateEnv(idx, "value", e.target.value)} />
                      <Button variant="outline" size="sm" onClick={()=>removeEnv(idx)} className="col-span-5 md:col-span-1 md:col-start-5 w-full md:w-auto"><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  ))}
                </div>
                <Button onClick={addEnv} variant="ghost" size="sm" className="mt-2"><Plus className="w-4 h-4 mr-1"/>Add ENV</Button>
              </div>

              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">Auto Volume Mount</div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" checked={autoVolume} onChange={(e)=>setAutoVolume(e.target.checked)} />
                    <span>{autoVolume ? "On" : "Off"}</span>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">표준 경로에 데이터를 자동 마운트합니다.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Startup Script</label>
                <textarea value={startupScript} onChange={(e)=>setStartupScript(e.target.value)} rows={6} className="w-full rounded-md border px-3 py-2 text-sm font-mono" placeholder="Enter scripts or cloud-config here"></textarea>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-[360px] space-y-3 lg:sticky lg:top-4">
          <Card>
            <CardHeader>
              <CardTitle>Review</CardTitle>
              <CardDescription>Instance Configuration</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-muted-foreground">Name</div>
                <div className="col-span-2">{machineName}</div>
                <div className="text-muted-foreground">Cloud</div>
                <div className="col-span-2">{provider}</div>
                <div className="text-muted-foreground">Region</div>
                <div className="col-span-2">{selectedRegion}</div>
                <div className="text-muted-foreground">Instance</div>
                <div className="col-span-2">{instance}</div>
                <div className="text-muted-foreground">GPU</div>
                <div className="col-span-2">{gpuCount} × {gpuModel}</div>
                <div className="text-muted-foreground">OS</div>
                <div className="col-span-2">{osImage}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="text-sm">
                <div className="text-muted-foreground">Total Cost</div>
                <div className="text-lg font-semibold">{currency === 'USD' ? '$' : ''}{totalCost.toFixed(2)}{currency === 'USD' ? '/hr' : ` ${currency}/hr`}</div>
              </div>
              <Button size="sm" onClick={handleDeploy} disabled={state === 'submitting'}>
                <Rocket className="w-4 h-4 mr-1"/>
                {state === 'submitting' ? 'Deploying...' : state === 'success' ? 'Deployed' : 'Deploy'}
              </Button>
            </CardContent>
          </Card>

          {state === 'error' && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {state === 'success' && (
            <div className="text-sm text-green-700">배포 요청이 접수되었습니다. 준비되는 동안 대시보드로 이동할 수 있어요.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading launch template...</div>}>
      <LaunchRunPage />
    </Suspense>
  )
}

