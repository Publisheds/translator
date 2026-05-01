import { API_KEYS } from "../config/keys"

// ─── Provider definitions ─────────────────────────────────────────────────────

export const PROVIDERS = [
  { id: "openai",   label: "OpenAI GPT-4o mini",  icon: "✦" },
  { id: "deepseek", label: "DeepSeek Chat",         icon: "◈" },
  { id: "deepl",    label: "DeepL",                 icon: "D" },
]

// Languages supported by each provider
const OPENAI_LANGS = [
  ["AR","Arabic"],["BG","Bulgarian"],["CA","Catalan"],["CS","Czech"],
  ["DA","Danish"],["DE","German"],["EL","Greek"],["EN","English"],
  ["ES","Spanish"],["ET","Estonian"],["FI","Finnish"],["FR","French"],
  ["HU","Hungarian"],["ID","Indonesian"],["IT","Italian"],["JA","Japanese"],
  ["KO","Korean"],["LT","Lithuanian"],["LV","Latvian"],["NB","Norwegian"],
  ["NL","Dutch"],["PL","Polish"],["PT","Portuguese"],["RO","Romanian"],
  ["RU","Russian"],["SK","Slovak"],["SL","Slovenian"],["SV","Swedish"],
  ["TR","Turkish"],["UK","Ukrainian"],["ZH","Chinese"],
]

const DEEPL_SOURCE_LANGS = [
  ["AR","Arabic"],["BG","Bulgarian"],["CS","Czech"],["DA","Danish"],
  ["DE","German"],["EL","Greek"],["EN","English"],["ES","Spanish"],
  ["ET","Estonian"],["FI","Finnish"],["FR","French"],["HU","Hungarian"],
  ["ID","Indonesian"],["IT","Italian"],["JA","Japanese"],["KO","Korean"],
  ["LT","Lithuanian"],["LV","Latvian"],["NB","Norwegian"],["NL","Dutch"],
  ["PL","Polish"],["PT","Portuguese"],["RO","Romanian"],["RU","Russian"],
  ["SK","Slovak"],["SL","Slovenian"],["SV","Swedish"],["TR","Turkish"],
  ["UK","Ukrainian"],["ZH","Chinese"],
]

const DEEPL_TARGET_LANGS = [
  ...DEEPL_SOURCE_LANGS,
  ["EN-GB","English (UK)"],["EN-US","English (US)"],
  ["PT-BR","Portuguese (Brazil)"],["PT-PT","Portuguese (Portugal)"],
]

export function getLanguages(providerId) {
  if (providerId === "deepl") {
    return { source: DEEPL_SOURCE_LANGS, target: DEEPL_TARGET_LANGS }
  }
  return { source: OPENAI_LANGS, target: OPENAI_LANGS }
}

// ─── Translation engine ───────────────────────────────────────────────────────

async function translateWithOpenAI(texts, sourceLang, targetLang, model = "gpt-4o-mini") {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEYS.openai}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following JSON array of strings from ${sourceLang} to ${targetLang}. Return ONLY a valid JSON array with the same number of elements in the same order. No explanations, no extra text. Preserve original casing.`,
        },
        { role: "user", content: JSON.stringify(texts) },
      ],
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`OpenAI error ${res.status}: ${err.error?.message || res.statusText}`)
  }

  const data = await res.json()
  const content = data.choices[0].message.content.trim()
  return JSON.parse(content)
}

async function translateWithDeepSeek(texts, sourceLang, targetLang) {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEYS.deepseek}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following JSON array of strings from ${sourceLang} to ${targetLang}. Return ONLY a valid JSON array with the same number of elements in the same order. No explanations, no extra text. Preserve original casing.`,
        },
        { role: "user", content: JSON.stringify(texts) },
      ],
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`DeepSeek error ${res.status}: ${err.error?.message || res.statusText}`)
  }

  const data = await res.json()
  const content = data.choices[0].message.content.trim()
  return JSON.parse(content)
}

async function translateWithDeepL(texts, sourceLang, targetLang) {
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `DeepL-Auth-Key ${API_KEYS.deepl}`,
    },
    body: JSON.stringify({
      text: texts,
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`DeepL error ${res.status}: ${err.message || res.statusText}`)
  }

  const data = await res.json()
  return data.translations.map((t) => t.text)
}

/**
 * Translate an array of strings using the specified provider.
 * Returns a string[] with translations in the same order.
 */
export async function translate(texts, sourceLang, targetLang, providerId) {
  if (!texts || texts.length === 0) return []

  switch (providerId) {
    case "openai":
      return translateWithOpenAI(texts, sourceLang, targetLang)
    case "deepseek":
      return translateWithDeepSeek(texts, sourceLang, targetLang)
    case "deepl":
      return translateWithDeepL(texts, sourceLang, targetLang)
    default:
      throw new Error(`Unknown provider: ${providerId}`)
  }
}
