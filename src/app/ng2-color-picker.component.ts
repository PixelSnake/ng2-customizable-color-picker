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

  enableDrag() {
    this.enable = true
  }

  @HostListener('document:mouseup')
  disableDrag() {
    this.dragging.circle = false
    this.dragging.triangle = false
    this.enable = false
  }

  click(e: MouseEvent) {
    this.drag(e, true)
  }

  drag(e: MouseEvent, force = false) {
    if (!this.dragging.any && !this.enable && !force) {
      return
    }

    const mouse = new Vector(e.offsetX, e.offsetY)
    const width = this.wheel.nativeElement.getBoundingClientRect().width
    const height = this.wheel.nativeElement.getBoundingClientRect().height
    const center = { x: width / 2, y: height / 2 }

    const dx = mouse.x - center.x
    const dy = mouse.y - center.y

    const distToCenter = Math.sqrt(dx * dx + dy * dy)

    if (distToCenter < 120 || this.dragging.triangle) {
      this.dragTriangle(e, center, mouse)
    } else if (distToCenter >= 120 && distToCenter <= 150 || this.dragging.circle) {
      this.dragCircle(e, center, mouse)
    }

    this.enable = false
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
