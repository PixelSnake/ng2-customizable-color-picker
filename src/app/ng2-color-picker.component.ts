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

  constructor() {

  }

  ngOnInit() {
    this.color = Color.fromHSV(0, 100, 100)
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
      console.log(rect)
      mouse.x -= rect.x
      mouse.y -= rect.y
    }

    const width = this.wheel.nativeElement.getBoundingClientRect().width
    const height = this.wheel.nativeElement.getBoundingClientRect().height
    const center = new Vector(width / 2, height / 2)

    const dx = mouse.x - center.x
    const dy = mouse.y - center.y

    const distToCenter = Math.sqrt(dx * dx + dy * dy)

    const triCorner1 = new Vector(110, 0).rotateDeg(this.color.h - 90).plus(center)
    const triCorner2 = new Vector(110, 0).rotateDeg(this.color.h - 90 - 120).plus(center)
    const triCorner3 = new Vector(110, 0).rotateDeg(this.color.h - 90 + 120).plus(center)
    const isInTriangle = this.ptInTriangle(mouse, triCorner1, triCorner2, triCorner3)

    if (distToCenter > 150 && !this.dragging.any) {
      // outside, do nothing
    } else if (isInTriangle && !this.dragging.circle || this.dragging.triangle) {
      this.dragTriangle(e, center, mouse)
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

  dragTriangle(e: MouseEvent, center, mouse) {
    if (this.enable) {
      this.dragging.triangle = true
    }

    const orientation = new Vector(110, 0).rotateDeg(this.color.h - 90 - 120)
    const val = orientation.rotateDeg(-120).plus(center)
    const sat = orientation.plus(center)
    const valDist = val.distTo(mouse)
    const satDist = sat.distTo(mouse)

    this.color.v = (valDist / 192 * 100)
    this.color.s = (satDist / 192 * 100)
  }

  get hueColor(): Color {
    return Color.fromHSV(this.color.h, 100, 100)
  }

  get transform(): string {
    return `rotate(${ this.color.h - 90 }deg)`
  }
}
