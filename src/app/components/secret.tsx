"use client"

import { useEffect, useState } from "react"

export default function Secret() {
  const [logedKey, setLogedKey] = useState<string[]>([])
  const [secret, setSecret] = useState(false)

  useEffect(() => {
    document.addEventListener("keydown", logKey)
    return () => {
      document.removeEventListener("keydown", logKey)
    }
  }, [logedKey])

  const logKey = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    setLogedKey((prev) => [...prev, key])
  }

  useEffect(() => {
    if (
      JSON.stringify(logedKey) ===
      JSON.stringify([
        "arrowup",
        "arrowup",
        "arrowdown",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "arrowleft",
        "arrowright",
        "b",
        "a",
      ])
    ) {
      setSecret(true)
      window.alert("You have unlocked the secret")
    }
  }, [logedKey])
  return <div>{secret && <div className="">hello :)</div>}</div>
}
