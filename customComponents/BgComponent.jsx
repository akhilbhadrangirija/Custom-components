import { useEffect, useMemo, useRef } from 'react'

function StarfieldComponent({ options, children }) {
  const starfieldRef = useRef(null)

  useEffect(() => {
    let starfieldInstance

    const initStarfield = () => {
      starfieldInstance = new Starfield(starfieldRef.current, options)
      starfieldInstance.start()
    }

    const cleanupStarfield = () => {
      if (starfieldInstance) {
        starfieldInstance.stop()
      }
    }
    initStarfield()
    // Cleanup on component unmount
    return cleanupStarfield
  }, [options])

  return <div ref={starfieldRef} className="min-h-screen min-w-screen"></div>
}

class Starfield {
  constructor(el, options) {
    this.el = el
    this.options = options
    this.isInited = false
    this.isPlaying = false
    this.animId = null
    this.canCanvas = false
    this.context = null
    this.handleOrientation = this.handleOrientation.bind(this)
    this.handleMousemove = this.handleMousemove.bind(this)

    // Other properties needed for starfield
    this.w = 0
    this.h = 0
    this.x = 0
    this.y = 0
    this.z = 0
    this.star_color_ratio = 0
    this.star_x_save = 0
    this.star_y_save = 0
    this.star_ratio = this.options.ratio || 256
    this.star_speed = this.options.speed || 1
    this.star_speed_save = 0
    this.star = []
    this.color = this.options.starColor || 'rgba(255,255,255,1)'
    this.opacity = 0.1

    this.cursor_x = 0
    this.cursor_y = 0
    this.mouse_x = 0
    this.mouse_y = 0

    this.fps = this.options.fps || 15

    this.desktop = !navigator.userAgent.match(
      /(iPhone|iPod|iPad|Android|BlackBerry|BB10|IEMobile)/
    )
    this.orientationSupport = window.DeviceOrientationEvent !== undefined
    this.portrait = null
  }

  resizer() {
    // Implementation of the resizer method
    // ...
  }

  init() {
    this.w = this.el.clientWidth
    this.h = this.el.clientHeight
    this.x = Math.round(this.w / 150)
    this.y = Math.round(this.h / 200)

    this.portrait = this.w < this.h

    // Check for canvas support
    this.starz = document.createElement('canvas')
    this.el.appendChild(this.starz)

    if (this.starz.getContext) {
      this.context = this.starz.getContext('2d')
      this.canCanvas = true
    }

    this.context.canvas.width = this.w
    this.context.canvas.height = this.h

    this.starColor = this.options.starColor || 'rgba(255,255,255,1)'
    this.bgColor = this.options.bgColor || 'rgba(0,0,0,8)'

    this.starInit()
  }

  starInit() {
    this.x = Math.round(this.w / 2)
    this.y = Math.round(this.h / 2)
    this.z = (this.w + this.h) / 2
    this.star_color_ratio = 1 / this.z
    this.cursor_x = this.x
    this.cursor_y = this.y

    for (let i = 0; i < this.options.quantity; i++) {
      this.star[i] = new Array(5)
      this.star[i][0] = Math.random() * this.w * 2 - this.x * 2
      this.star[i][1] = Math.random() * this.h * 2 - this.y * 2
      this.star[i][2] = Math.round(Math.random() * this.z)
      this.star[i][3] = 0
      this.star[i][4] = 0
    }

    this.context.fillStyle = this.bgColor
    this.context.strokeStyle = this.starColor
  }

  anim() {
    this.mouse_x = this.cursor_x - this.x
    this.mouse_y = this.cursor_y - this.y
    this.context.fillRect(0, 0, this.w, this.h)

    for (let i = 0; i < this.options.quantity; i++) {
      this.test = true
      this.star_x_save = this.star[i][3]
      this.star_y_save = this.star[i][4]
      this.star[i][0] += this.mouse_x >> 7

      // X coords
      if (this.star[i][0] > this.x << 1) {
        this.star[i][0] -= this.w << 1
        this.test = false
      }
      if (this.star[i][0] < -this.x << 1) {
        this.star[i][0] += this.w << 1
        this.test = false
      }

      // Y coords
      this.star[i][1] += this.mouse_y >> 7
      if (this.star[i][1] > this.y << 1) {
        this.star[i][1] -= this.h << 1
        this.test = false
      }
      if (this.star[i][1] < -this.y << 1) {
        this.star[i][1] += this.h << 1
        this.test = false
      }

      // Z coords
      this.star[i][2] -= this.star_speed
      if (this.star[i][2] > this.z) {
        this.star[i][2] -= this.z
        this.test = false
      }
      if (this.star[i][2] < 0) {
        this.star[i][2] += this.z
        this.test = false
      }

      this.star[i][3] =
        this.x + (this.star[i][0] / this.star[i][2]) * this.star_ratio
      this.star[i][4] =
        this.y + (this.star[i][1] / this.star[i][2]) * this.star_ratio

      if (
        this.star_x_save > 0 &&
        this.star_x_save < this.w &&
        this.star_y_save > 0 &&
        this.star_y_save < this.h &&
        this.test
      ) {
        this.context.lineWidth =
          (1 - this.star_color_ratio * this.star[i][2]) * 2
        this.context.beginPath()
        this.context.moveTo(this.star_x_save, this.star_y_save)
        this.context.lineTo(this.star[i][3], this.star[i][4])
        this.context.stroke()
        this.context.closePath()
      }
    }
  }

  loop() {
    this.anim()
    this.animId = window.requestAnimationFrame(() => this.loop())
  }

  move() {
    const doc = document.documentElement

    if (this.orientationSupport && !this.desktop) {
      window.addEventListener(
        'deviceorientation',
        this.handleOrientation,
        false
      )
    } else {
      window.addEventListener('mousemove', this.handleMousemove, false)
    }
  }
  handleOrientation(event) {
    if (event.beta !== null && event.gamma !== null) {
      let x = event.gamma
      let y = event.beta

      if (!this.portrait) {
        x = event.beta * -1
        y = event.gamma
      }

      this.cursor_x = this.w / 2 + x * 5
      this.cursor_y = this.h / 2 + y * 5
    }
  }

  handleMousemove(event) {
    this.cursor_x =
      event.pageX ||
      event.clientX +
        document.documentElement.scrollLeft -
        document.documentElement.clientLeft
    this.cursor_y =
      event.pageY ||
      event.clientY +
        document.documentElement.scrollTop -
        document.documentElement.clientTop
  }

  stop() {
    window.cancelAnimationFrame(this.animId)
    this.isPlaying = false
  }

  start() {
    if (!this.isInited) {
      this.isInited = true
      this.init()
    }

    if (!this.isPlaying) {
      this.isPlaying = true
      this.loop()
    }

    window.addEventListener('resize', this.resizer.bind(this), false)
    window.addEventListener('orientationchange', this.resizer.bind(this), false)

    if (this.options.mouseMove) {
      this.move()
    }
  }
}

function BgComponent({
  children,
  bgColor = 'rgba(0, 0, 0, 0.8)',
  starColor = 'rgba(255,255,255,1)'
}) {
  const starfieldOptions = useMemo(() => {
    return {
      starColor: starColor,
      bgColor: bgColor,
      mouseMove: true,
      mouseColor: 'rgba(0,0,0,0.2)',
      mouseSpeed: 0.01,
      fps: 15,
      speed: 1,
      quantity: 512,
      ratio: 256,
      divclass: 'starfield'
    }
  }, [starColor, bgColor])

  return (
    <div className="relative">
      <StarfieldComponent options={starfieldOptions} />
      <div className="absolute top-0 left-0 w-full">{children}</div>
    </div>
  )
}

export default BgComponent
