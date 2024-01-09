class Polygon {
  constructor(points) {
    this.points = points

    this.lines = []
    for (let i = 1; i <= points.length; i ++) {
      this.lines.push(
        new Line(points[i - 1], points[i % points.length])
      )
    }
  }

  static union(polys) {
    Polygon.multiBreak(polys)
    const keptLines = []
    for (let i = 0; i < polys.length; i ++) {
      for (const l of polys[i].lines) {
        let keep = true
        for (let j = 0; j < polys.length; j ++) {
          if (i != j) {
            if (polys[j].containsLine(l)) {
              keep = false
              this.break
            }
          }
        }
        if (keep) {
          keptLines.push(l)
        }
      }
    }
    return keptLines
  }

  static multiBreak(polys) {
    for (let i = 0; i < polys.length - 1; i ++) {
      for (let j = i + 1; j < polys.length; j ++) {
        Polygon.break(polys[i], polys[j])
      }
    }
  }

  static break(poly1, poly2) {
    const lines1 = poly1.lines
    const lines2 = poly2.lines
    for (let i = 0; i < lines1.length; i ++) {
      for (let j = 0; j < lines2.length; j ++) {
        const int = getIntersection(
          lines1[i].p1, lines1[i].p2, lines2[j].p1, lines2[j].p2
        )
        if (int && int.offset != 0 && int.offset != 1) {
          const point = new Point(int.x, int.y)
          let aux = lines1[i].p2
          lines1[i].p2 = point
          lines1.splice(i + 1, 0, new Line(point, aux))

          aux = lines2[j].p2
          lines2[j].p2 = point
          lines2.splice(j + 1, 0, new Line(point, aux))
        }
      }
    }
  }

  distanceToPoint(point) {
    return Math.min(...this.lines.map((l) => l.distanceToPoint(point)))
  }

  distanceToPoly(poly) {
    return Math.min(...this.points.map((p) => poly.distanceToPoint(p)))
  }

  intersectsPoly(poly) {
    for (let l1 of this.lines) {
      for (let l2 of poly.lines) {
        if (getIntersection(l1.p1, l1.p2, l2.p1, l2.p2)) {
          return true
        }
      }
    }
    return false
  }

  containsLine(line) {
    const midPoint = average(line.p1, line.p2) 
    return this.containsPoint(midPoint)
  }

  containsPoint(point) {
    const outerPoint = new Point(-1000, -1000)
    let intersectionCount = 0
    for (const l of this.lines) {
      const int = getIntersection(outerPoint, point, l.p1, l.p2)
      if (int) {
        intersectionCount ++
      }
    }
    return intersectionCount % 2 == 1
  }

  drawLines(ctx) {
    for (const l of this.lines) {
      l.draw(ctx, { color: getRandomColor(), width: 5 })
    }
  }

  draw(ctx, {stroke = "blue", lineWidth = 2, fill = "rgba(0, 0, 255, 0.3)"} = {}) {
    if (this.points.length <=0) {
      return
    }
    ctx.beginPath()
    ctx.fillStyle = fill
    ctx.strokeStyle = stroke
    ctx.lineWidth = lineWidth
    ctx.moveTo(this.points[0].x, this.points[0].y)
    for (let i = 1; i < this.points.length; i ++) {
      ctx.lineTo(this.points[i].x, this.points[i].y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
}