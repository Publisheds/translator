import { useState, useEffect, useCallback } from "react"
import { Layers, MousePointer, FileText, BookOpen, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select"
import { translate, PROVIDERS, getLanguages } from "../services/translate"

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS = {
  IDLE: "idle",
  RUNNING: "running",
  DONE: "done",
  ERROR: "error",
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function TranslatorPanel() {
  const [providerId, setProviderId]         = useState("openai")
  const [sourceLang, setSourceLang]         = useState("")
  const [targetLang, setTargetLang]         = useState("")
  const [languages, setLanguages]           = useState({ source: [], target: [] })
  const [status, setStatus]                 = useState(STATUS.IDLE)
  const [statusMsg, setStatusMsg]           = useState("")
  const [progress, setProgress]             = useState(0)
  const [pageInfo, setPageInfo]             = useState({ current: 0, total: 0 })

  // Reload language lists when provider changes
  useEffect(() => {
    const langs = getLanguages(providerId)
    setLanguages(langs)
    setSourceLang(langs.source[6]?.[0] ?? langs.source[0]?.[0] ?? "")  // default EN
    setTargetLang(langs.target[6]?.[0] ?? langs.target[0]?.[0] ?? "")
  }, [providerId])

  // ─── Core translation helpers ──────────────────────────────────────────────

  function parseHostResponse(raw) {
    return JSON.parse(decodeURIComponent(raw))
  }

  function validate() {
    if (!sourceLang) { alert("Seleccioná el idioma de origen."); return false }
    if (!targetLang) { alert("Seleccioná el idioma de destino."); return false }
    if (sourceLang === targetLang) { alert("El idioma origen y destino son iguales."); return false }
    return true
  }

  async function applyTranslation(rawResponse) {
    const items = parseHostResponse(rawResponse)          // [[hash, text], ...]
    if (!items.length) {
      alert("No se encontró texto en la selección.")
      return
    }
    const texts = items.map((r) => r[1])
    const translated = await translate(texts, sourceLang, targetLang, providerId)

    if (translated.length !== items.length) {
      throw new Error(`Cantidad de textos no coincide: esperados ${items.length}, recibidos ${translated.length}`)
    }

    const paired = translated.map((t, i) => [items[i], t])
    return paired
  }

  // ─── Translate selection ───────────────────────────────────────────────────

  const handleSelection = useCallback(async () => {
    if (!validate()) return
    setStatus(STATUS.RUNNING)
    setStatusMsg("Obteniendo textos de la selección…")
    setProgress(0)

    try {
      const raw = await window.session.getAllTexts({ id: "Selección" })
      setStatusMsg("Traduciendo…")
      setProgress(40)
      const paired = await applyTranslation(raw)
      setProgress(80)
      setStatusMsg("Aplicando traducciones…")
      await window.session.setAllTexts({ id: "Selección", data: paired })
      setProgress(100)
      setStatus(STATUS.DONE)
      setStatusMsg("¡Selección traducida!")
    } catch (err) {
      setStatus(STATUS.ERROR)
      setStatusMsg(`Error: ${err.message}`)
    }
  }, [sourceLang, targetLang, providerId])

  // ─── Translate artboard / page ─────────────────────────────────────────────

  const handleArtboard = useCallback(async () => {
    if (!validate()) return
    setStatus(STATUS.RUNNING)
    setStatusMsg("Obteniendo textos de la página/artboard…")
    setProgress(0)

    try {
      const raw = await window.session.getAllTexts({ id: "Artboard" })
      setStatusMsg("Traduciendo…")
      setProgress(40)
      const paired = await applyTranslation(raw)
      setProgress(80)
      setStatusMsg("Aplicando traducciones…")
      await window.session.setAllTexts({ id: "Artboard", data: paired })
      setProgress(100)
      setStatus(STATUS.DONE)
      setStatusMsg("¡Página traducida!")
    } catch (err) {
      setStatus(STATUS.ERROR)
      setStatusMsg(`Error: ${err.message}`)
    }
  }, [sourceLang, targetLang, providerId])

  // ─── Translate full document page by page ─────────────────────────────────

  const handleDocument = useCallback(async () => {
    if (!validate()) return
    setStatus(STATUS.RUNNING)
    setProgress(0)

    try {
      // Get total number of pages/artboards
      const raw = await window.session.getPageCount()
      const { count } = JSON.parse(decodeURIComponent(raw))

      if (!count || count === 0) {
        alert("El documento no tiene páginas.")
        setStatus(STATUS.IDLE)
        return
      }

      setPageInfo({ current: 0, total: count })

      for (let i = 0; i < count; i++) {
        setPageInfo({ current: i + 1, total: count })
        setStatusMsg(`Obteniendo textos — página ${i + 1} de ${count}…`)

        const rawPage = await window.session.getPageTexts({ pageIndex: i })
        const items = parseHostResponse(rawPage)

        if (items.length > 0) {
          setStatusMsg(`Traduciendo página ${i + 1} de ${count}…`)
          const texts = items.map((r) => r[1])
          const translated = await translate(texts, sourceLang, targetLang, providerId)

          if (translated.length !== items.length) {
            console.warn(`Página ${i + 1}: se esperaban ${items.length} traducciones, se recibieron ${translated.length}`)
          }

          const paired = translated.map((t, idx) => [items[idx], t])
          setStatusMsg(`Aplicando página ${i + 1} de ${count}…`)
          await window.session.setPageTexts({ pageIndex: i, data: paired })
        }

        setProgress(Math.round(((i + 1) / count) * 100))
      }

      setStatus(STATUS.DONE)
      setStatusMsg(`¡Documento completo traducido! (${count} páginas)`)
    } catch (err) {
      setStatus(STATUS.ERROR)
      setStatusMsg(`Error: ${err.message}`)
    }
  }, [sourceLang, targetLang, providerId])

  // ─── Status indicator ─────────────────────────────────────────────────────

  function StatusRow() {
    if (status === STATUS.IDLE) return null

    const icons = {
      [STATUS.RUNNING]:  <Loader2 className="h-4 w-4 animate-spin text-primary" />,
      [STATUS.DONE]:     <CheckCircle2 className="h-4 w-4 text-green-500" />,
      [STATUS.ERROR]:    <AlertCircle className="h-4 w-4 text-red-500" />,
    }

    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icons[status]}
          <span>{statusMsg}</span>
        </div>
        {(status === STATUS.RUNNING || status === STATUS.DONE) && (
          <Progress value={progress} />
        )}
        {status === STATUS.RUNNING && pageInfo.total > 0 && (
          <p className="text-xs text-right text-muted-foreground">
            Página {pageInfo.current} de {pageInfo.total}
          </p>
        )}
      </div>
    )
  }

  const isRunning = status === STATUS.RUNNING
  const currentProvider = PROVIDERS.find((p) => p.id === providerId)

  return (
    <div className="flex flex-col h-full bg-background text-foreground p-3 gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold tracking-tight">Liwit Translator</h1>
          <p className="text-xs text-muted-foreground">Adobe CEP Extension</p>
        </div>
        <Badge variant="secondary" className="text-xs gap-1">
          <span>{currentProvider?.icon}</span>
          {currentProvider?.label}
        </Badge>
      </div>

      {/* Settings card */}
      <Card>
        <CardContent className="pt-4 space-y-3">

          {/* Provider selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Proveedor de traducción</label>
            <Select value={providerId} onValueChange={setProviderId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.icon} {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language selectors */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Origen</label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Idioma…" />
                </SelectTrigger>
                <SelectContent>
                  {languages.source.map(([code, name]) => (
                    <SelectItem key={code} value={code} className="text-xs">{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Destino</label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Idioma…" />
                </SelectTrigger>
                <SelectContent>
                  {languages.target.map(([code, name]) => (
                    <SelectItem key={code} value={code} className="text-xs">{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Traducir</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col h-14 gap-1 text-xs"
            onClick={handleSelection}
            disabled={isRunning}
          >
            <MousePointer className="h-4 w-4" />
            Selección
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col h-14 gap-1 text-xs"
            onClick={handleArtboard}
            disabled={isRunning}
          >
            <Layers className="h-4 w-4" />
            Página
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex flex-col h-14 gap-1 text-xs"
            onClick={handleDocument}
            disabled={isRunning}
          >
            <BookOpen className="h-4 w-4" />
            Documento
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          "Documento" traduce el libro completo página a página
        </p>
      </div>

      {/* Status / progress */}
      <StatusRow />

      {/* Reset button after error */}
      {(status === STATUS.ERROR || status === STATUS.DONE) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs mt-auto"
          onClick={() => { setStatus(STATUS.IDLE); setStatusMsg(""); setProgress(0); setPageInfo({ current: 0, total: 0 }) }}
        >
          Nueva traducción
        </Button>
      )}
    </div>
  )
}
