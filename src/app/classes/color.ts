export class Color {
  private _h: number
  private _s: number
  private _l: number

  static fromRGB(r: number, g: number, b: number): Color {
    const hsl = rgb2hsl(r, g, b)
    return new Color(hsl[0], hsl[1], hsl[2])
  }

  static fromHSL(h: number, s: number, l: number): Color {
    return new Color(h, s, l)
  }

  private constructor(h: number, s: number, v: number) {
    this.h = h
    this.s = s
    this.l = v
  }

  public toString(): string {
    const rgb = hsl2rgb(this.h, this.s / 100, this.l / 100)
    return '#' + rgb.map(v => (v.toString(16) as any).padStart(2, '0')).join('')
  }

  get h(): number {
    return this._h
  }

  get s(): number {
    return this._s
  }

  get l(): number {
    return this._l
  }

  set h(val: number) {
    this._h = val % 360
  }

  set s(val: number) {
    this._s = Math.max(Math.min(val, 100), 0)
  }

  set l(val: number) {
    this._l = Math.max(Math.min(val, 100), 0)
  }
}

// expected hue range: [0, 360)
// expected saturation range: [0, 1]
// expected lightness range: [0, 1]
function hsl2rgb(hue, saturation, lightness) {
  // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
  if (hue === undefined) {
    return [0, 0, 0]
  }

  const chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation
  let huePrime = hue / 60
  const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1))

  huePrime = Math.floor(huePrime)
  let red
  let green
  let blue

  if (huePrime === 0) {
    red = chroma
    green = secondComponent
    blue = 0
  } else if (huePrime === 1) {
    red = secondComponent
    green = chroma
    blue = 0
  } else if (huePrime === 2) {
    red = 0
    green = chroma
    blue = secondComponent
  } else if (huePrime === 3) {
    red = 0
    green = secondComponent
    blue = chroma
  } else if (huePrime === 4) {
    red = secondComponent
    green = 0
    blue = chroma
  } else if (huePrime === 5) {
    red = chroma
    green = 0
    blue = secondComponent
  }

  const lightnessAdjustment = lightness - (chroma / 2)
  red += lightnessAdjustment
  green += lightnessAdjustment
  blue += lightnessAdjustment

  return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)]
}

function rgb2hsl(r, g, b) {
  let d, h, l, max, min, s
  r /= 255
  g /= 255
  b /= 255
  max = Math.max(r, g, b)
  min = Math.min(r, g, b)
  h = 0
  s = 0
  l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  h = h * 360
  s = (s * 100)
  l = (l * 100)
  return [h, s, l]
}
