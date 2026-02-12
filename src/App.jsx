import { useState, useEffect } from "react"
import "./App.css"
import ConfettiCanvas from "./ConfettiCanvas.jsx"
import catGif from './assets/cat-cat-love.gif'

function App() {
  const [noStyle, setNoStyle] = useState({})
  const [saidYes, setSaidYes] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("saidYes")
    if (saved === "true") {
      setSaidYes(true)
    }
  }, [])

const moveNoButton = (e) => {
  const minMove = 100
  const maxMove = 150

  const button = e.currentTarget
  const rect = button.getBoundingClientRect()

  const cursorX = e.clientX
  const cursorY = e.clientY

  let x, y
  let isCursorInside

  do {
    x = Math.random() * maxMove * 2 - maxMove
    y = Math.random() * maxMove * 2 - maxMove

    const moveDistance = Math.sqrt(x * x + y * y)

    if (moveDistance < minMove) continue
    // Calculate future button bounds after translate
    const newLeft = rect.left + x
    const newRight = rect.right + x
    const newTop = rect.top + y
    const newBottom = rect.bottom + y

    // Check if cursor would still be inside
    isCursorInside =
      cursorX >= newLeft &&
      cursorX <= newRight &&
      cursorY >= newTop &&
      cursorY <= newBottom

  } while (isCursorInside)

  setNoStyle({
    transform: `translate(${x}px, ${y}px)`
  })
}
  const handleYes = () => {
    localStorage.setItem("saidYes", "true")
    setSaidYes(true)
  }

  const handleReset = () => {
    localStorage.removeItem("saidYes")
    setSaidYes(false)
    setNoStyle({})
    window.location.reload()
  }

  if (saidYes) {
  return (
    <div className="page">
      <ConfettiCanvas />

      <div className="card" style={{ position: "relative", zIndex: 1 }}>
        <h1>💖 Hooray!!! 💖</h1>
        <img src={catGif}/>
        <p className="love-message">
          pls let me crack 🥺
        </p>

        <button className="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

  return (
    <div className="page">
      <div className="card">
        <h1>Will you be my Valentine? 🥺🥺🥺</h1>
        <p>You da love of ma life :3</p>

        <div className="buttons">
          <button className="yes" onClick={handleYes}>
            Yes :)
          </button>

          <button
            className="no"
            onMouseOver={moveNoButton}
            style={noStyle}
          >
            No :(
          </button>
        </div>
      </div>
    </div>
  )
}

export default App