import React, { useState } from "react"
import useScript from "../hooks/useScript"
import PyEditor from "./PyEditor"
import Output from "./Output"

type QuizProps = {
  editorInitialValue: string
}

const Quiz: React.FunctionComponent<QuizProps> = ({ editorInitialValue }) => {
  const [skulptLoaded, skulptError] = useScript(
    "http://localhost:1234/skulpt.min.js",
  )
  const [stdlibLoaded, stdlibError] = useScript(
    "http://localhost:1234/skulpt-stdlib.js",
  )
  const [progOutput, setProgOutput] = useState("")

  let Sk: any = {}
  if (skulptLoaded && !skulptError) Sk = (window as any).Sk

  function outf(text: string) {
    setProgOutput(prevState => prevState + text)
  }

  function builtinRead(x: any) {
    if (
      Sk.builtinFiles === undefined ||
      Sk.builtinFiles["files"][x] === undefined
    )
      throw "File not found: '" + x + "'"
    return Sk.builtinFiles["files"][x]
  }

  function handleRun(code: string) {
    if (!code || code.length === 0) return
    setProgOutput("")

    Sk.configure({
      output: outf,
      read: builtinRead,
      __future__: Sk.python3,
    })

    try {
      Sk.importMainWithBody("<stdin>", false, code, true)
    } catch (e) {
      console.log(e)
      setProgOutput(e.toString())
    }
  }

  return (
    <div style={{ position: "relative", width: "70vw" }}>
      <p>This is a quiz.</p>
      <PyEditor initialValue={editorInitialValue} handleRun={handleRun} />
      <Output outputText={progOutput} clearOutput={() => setProgOutput("")} />
    </div>
  )
}

export { Quiz, QuizProps }