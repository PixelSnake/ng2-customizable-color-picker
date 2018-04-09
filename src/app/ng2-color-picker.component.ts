import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'
import { Color } from './classes/color'
import { Vector } from './classes/vector'

@Component({
  selector: 'cp-ng2-color-picker',
  templateUrl: './ng2-color-picker.component.html',
  styleUrls: ['./ng2-color-picker.component.scss']
})
export class Ng2ColorPickerComponent implements OnInit {
  @ViewChild('wheel') wheel: ElementRef
  color: Color
  enable = false
  dragging = {
    circle: false,
    triangle: false,
    get any() {
      return this.circle || this.triangle
    }
  }

  _debugPoints = {}
  get debugPoints(): Vector[] {
    const ret = []
    for (const key in this._debugPoints) {
      if (this._debugPoints.hasOwnProperty(key)) {
        ret.push(this._debugPoints[key])
      }
    }
    return ret
  }

  constructor() {

  }

  ngOnInit() {
    this.color = Color.fromHSL(90, 100, 50)
  }

  enableDrag(e: MouseEvent) {
    this.enable = true
    this.drag(e)
  }

  @HostListener('document:mouseup')
  disableDrag() {
    this.dragging.circle = false
    this.dragging.triangle = false
    this.enable = false
  }

  drag(e: MouseEvent, force = false) {
    if (!force) {
      if (!this.dragging.any && !this.enable) {
        return
      }
    }

    const mouse = new Vector(e.offsetX, e.offsetY)

    if (this.dragging.any) {
      // mouselistener is maximized, we need to add an offset to the positions
      const rect = this.wheel.nativeElement.getBoundingClientRect()
      mouse.x -= rect.x
      mouse.y -= rect.y
    }

    const width = this.wheel.nativeElement.getBoundingClientRect().width
    const height = this.wheel.nativeElement.getBoundingClientRect().height
    const center = new Vector(width / 2, height / 2)

    const dx = mouse.x - center.x
    const dy = mouse.y - center.y

    const distToCenter = Math.sqrt(dx ** 2 + dy ** 2)

    const triCorner1 = new Vector(110, 0).rotateDeg(this.color.h - 90).plus(center)
    const triCorner2 = new Vector(110, 0).rotateDeg(this.color.h - 90 - 120).plus(center)
    const triCorner3 = new Vector(110, 0).rotateDeg(this.color.h - 90 + 120).plus(center)
    const isInTriangle = this.ptInTriangle(mouse, triCorner1, triCorner2, triCorner3)

    if (distToCenter > 150 && !this.dragging.any) {
      // outside, do nothing
    } else if (isInTriangle && !this.dragging.circle || this.dragging.triangle) {
      this.dragTriangle(e, center, mouse, isInTriangle, [triCorner1, triCorner2, triCorner3])
    } else if (!isInTriangle && !this.dragging.triangle || this.dragging.circle) {
      this.dragCircle(e, center, mouse)
    }

    this.enable = false
  }

  private ptInTriangle(p: Vector, p0: Vector, p1: Vector, p2: Vector) {
    const A = .5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y)
    const sign = A < 0 ? -1 : 1
    const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign
    const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign

    return s > 0 && t > 0 && (s + t) < 2 * A * sign
  }

  dragCircle(e: MouseEvent, center, mouse) {
    if (this.enable) {
      this.dragging.circle = true
    }

    const hVec = new Vector(center.x, center.y)
    let angle = hVec.angleDeg(mouse) + 90
    if (angle < 0) {
      angle += 360
    }
    this.color.h = angle
  }

  dragTriangle(e: MouseEvent, center, mouse, isInside, triangle: Vector[]) {
    if (this.enable) {
      this.dragging.triangle = true
    }

    if (!isInside) {
      // we have to find the closest point on in the triangle
      mouse = this.getClosestPointOnTriangle(mouse, triangle[0], triangle[1], triangle[2])
    }

    const saturationOne = new Vector(110, 0).rotateDeg(this.color.h - 90)
    const saturationZero = saturationOne.plus(new Vector(110, 0).rotateDeg(this.color.h + 90).times(1.5))
    const saturationLine = [saturationOne.plus(center), saturationZero.plus(center)]
    const saturation = this.getClosestPointOnLine(mouse, saturationLine[0], saturationLine[1]).distTo(saturationLine[1]) / 165
    this.color.s = saturation * 100

    const lightnessOne = new Vector(110, 0).rotateDeg(this.color.h - 90 - 120)
    const lightnessZero = new Vector(110, 0).rotateDeg(this.color.h - 90 + 120)
    const lightnessLine = [lightnessOne.plus(center), lightnessZero.plus(center)]
    const lightness = this.getClosestPointOnLine(mouse, lightnessLine[0], lightnessLine[1]).distTo(lightnessLine[1]) / lightnessLine[0].distTo(lightnessLine[1])
    this.color.l = lightness * 100
  }

  private getClosestPointOnTriangle(p: Vector, p1: Vector, p2: Vector, p3: Vector): Vector {
    const l1 = this.getClosestPointOnLine(p, p1, p2)
    const l2 = this.getClosestPointOnLine(p, p2, p3)
    const l3 = this.getClosestPointOnLine(p, p3, p1)

    const vecs = [l1, l2, l3]
    let min: Vector
    let minDist: number
    vecs.forEach(v => {
      const d = v.distTo(p)
      if (d < minDist || !min) {
        min = v
        minDist = d
      }
    })

    return min
  }

  private getClosestPointOnLine(p: Vector, a: Vector, b: Vector): Vector {
    const AP = p.minus(a)
    const AB = b.minus(a)
    const AB2 = AB.x ** 2 + AB.y ** 2
    const APdotAB = AP.dot(AB)
    const t = APdotAB / AB2
    if (t < 0) {
      return a
    } else if (t > 1) {
      return b
    } else {
      return new Vector(a.x + AB.x * t, a.y + AB.y * t)
    }
  }

  get hueColor(): Color {
    return Color.fromHSL(this.color.h, 100, 50)
  }

  get transform(): string {
    return `rotate(${ this.color.h - 90 }deg)`
  }

  get pointY() {
    return 170 - this.color.l * 1.4
  }

  get pointX() {
    return 60 + this.color.s * 1.2
  }
}
