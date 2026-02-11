import { useEffect, useRef } from "react"
import p5 from "p5"

export default function ConfettiCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    let sketch = (p) => {
      let confettis
      let nouvelle, ancienne
      let pression = false

      const themeCouleur = [
        "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5",
        "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4CAF50",
        "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800",
        "#FF5722"
      ]

      class Particule {
        constructor(parent) {
          this.parent = parent
          this.gravite = parent.gravite
          this.reinit()
          this.forme = Math.round(p.random(0, 1))
          this.etape = 0
          this.prise = 0
          this.priseFacteur = p.random(-0.02, 0.02)
          this.multFacteur = p.random(0.01, 0.08)
          this.priseAngle = 0
          this.priseVitesse = 0.05
        }

        reinit() {
          this.position = this.parent.position.copy()
          this.position.y = p.random(-20, -100)
          this.position.x = p.random(0, p.width)
          this.velocite = p.createVector(p.random(-6, 6), p.random(-10, 2))
          this.friction = p.random(0.98, 0.995)
          this.taille = Math.round(p.random(5, 15))
          this.moitie = this.taille / 2
          this.couleur = p.color(p.random(themeCouleur))
        }

        integration() {
          this.velocite.add(this.gravite)
          this.velocite.x += this.prise
          this.velocite.mult(this.friction)
          this.position.add(this.velocite)

          if (
            this.position.y > p.height ||
            this.position.x < 0 ||
            this.position.x > p.width
          ) {
            this.reinit()
          }
        }

        dessiner() {
          this.etape = 0.5 + Math.sin(this.velocite.y * 20) * 0.5
          this.prise =
            this.priseFacteur +
            Math.cos(this.priseAngle) * this.multFacteur
          this.priseAngle += this.priseVitesse

          p.push()
          p.translate(this.position.x, this.position.y)
          p.rotate(this.velocite.x * 2)
          p.scale(1, this.etape)
          p.noStroke()
          p.fill(this.couleur)

          if (this.forme === 0) {
            p.rect(-this.moitie, -this.moitie, this.taille, this.taille)
          } else {
            p.ellipse(0, 0, this.taille, this.taille)
          }

          p.pop()
        }

        rendu() {
          this.integration()
          this.dessiner()
        }
      }

      class SystemeDeParticules {
        constructor(nombreMax, position) {
          this.position = position.copy()
          this.nombreMax = nombreMax
          this.gravite = p.createVector(0, 0.1)
          this.particules = []

          for (let i = 0; i < this.nombreMax; i++) {
            this.particules.push(new Particule(this))
          }
        }

        rendu() {
          this.particules.forEach((particule) => particule.rendu())
        }
      }

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight)
        nouvelle = p.createVector(0, 0)
        ancienne = p.createVector(0, 0)
        confettis = new SystemeDeParticules(
          400,
          p.createVector(p.width / 2, -20)
        )
      }

      p.draw = () => {
        p.clear()
        confettis.rendu()
      }

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
      }
    }

    const p5Instance = new p5(sketch, containerRef.current)

    return () => {
      p5Instance.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none"
      }}
    />
  )
}