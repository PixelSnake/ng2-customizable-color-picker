export class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public plus(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  public minus(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  public dot(v: Vector): number {
    return this.x * v.x + this.y * v.y
  }

  public times(n: number): Vector {
    return new Vector(this.x * n, this.y * n)
  }

  public abs(): Vector {
    const len = this.len()
    return new Vector(this.x / len, this.y / len)
  }

  public len(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  public angleDeg(v: Vector): number {
    return Math.atan2(v.y - this.y, v.x - this.x) * 180 / Math.PI
  }

  public rotateDeg(deg: number): Vector {
    const rad = deg * Math.PI / 180
    return this.rotateRad(rad)
  }

  public rotateRad(rad: number): Vector {
    const vec = new Vector(this.x, this.y)
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    vec.x = this.x * cos - this.y * sin
    vec.y = this.x * sin + this.y * cos
    return vec
  }

  public distTo(v: Vector): number {
    const dx = this.x - v.x
    const dy = this.y - v.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}
