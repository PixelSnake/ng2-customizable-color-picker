import * as hsv2rgb from 'hsv-rgb'

export interface RGBColor {
  r: number
  g: number
  b: number
}

export class Color {
  private _h: number
  private _s: number
  private _v: number

  static fromRGB(r: number, g: number, b: number): Color {
    return null
  }

  static fromHSV(h: number, s: number, v: number): Color {
    return new Color(h, s, v)
  }

  private constructor(h: number, s: number, v: number) {
    this.h = h
    this.s = s
    this.v = v
  }

  public toString(): string {
    const rgb = hsv2rgb(this.h, this.s, this.v)
    return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('')
  }

  get h(): number { return this._h }
  get s(): number { return this._s }
  get v(): number { return this._v }
  set h(val: number) { this._h = val % 360 }
  set s(val: number) { this._s = Math.max(Math.min(val, 100), 0) }
  set v(val: number) { this._v = Math.max(Math.min(val, 100), 0) }
}
