class Graph {
  constructor(points = [], lines = []) {
    this.points = points
    this.lines = lines
  }

  static load(info) {
    const points = info.points.map((i) => new Point(i.x, i.y))
    const lines = info.lines.map((i) => new Line(points.find(p => p.equals(i.p1)),  points.find(p => p.equals(i.p2))))
    return new Graph(points, lines)
  }

  hash() {
    return JSON.stringify(this)
  }

  addPoint(point) {
    this.points.push(point)
  }

  containsPoint(point) {
    return this.points.find((p) => p.equals(point))
  }

  tryAddPoint(point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point)
      return true
    }
    return false
  }

  removePoint(point) {
    const lines = this.getLineWithPoint(point)
    for (const line of lines) {
      this.removeLine(line)
    }
    this.points.splice(this.points.indexOf(point), 1)
  }

  addLine(line) {
    this.lines.push(line)
  }

  containsLine(line) {
    return this.lines.find((l) => l.equals(line))
  }

  tryAddLine(line) {
    if (!this.containsLine(line) && !line.p1.equals(line.p2)) {
      this.addLine(line)
      return true
    }
    return false
  }

  removeLine(line) {
    this.lines.splice(this.lines.indexOf(line), 1)
  }

  getLineWithPoint(point) {
    const lines = []
    for (const line of this.lines) {
      if (line.includes(point)) {
        lines.push(line)
      }
    }
    return lines
  }

  dispose() {
    this.points.length = 0
    this.lines.length = 0
  }

  draw(ctx) {
    for (const line of this.lines) {
      line.draw(ctx)
    }
    for (const point of this.points) {
      point.draw(ctx)
    }
  }
}