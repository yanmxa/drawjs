class StopEditor {
  constructor(viewport, world) {
    this.viewport = viewport
    this.world = world

    this.canvas = viewport.canvas
    this.ctx = this.canvas.getContext("2d")

    this.mouse = null
    this.intent = null

    this.markings = world.markings
  }

  enable() {
    this.#addEventListeners()
  }

  disable() {
    this.#removeEventListeners()
  }

  display() {
    if (this.intent) {
      this.intent.draw(this.ctx)
    }
  }


  #addEventListeners() {
    this.boundMouseDown = this.#handleMouseDown.bind(this)
    this.boundMouseMove = this.#handleMouseMove.bind(this)
    this.boundContextMenu = (evt) => evt.preventDefault()
    this.canvas.addEventListener("mousedown", this.boundMouseDown)
    this.canvas.addEventListener("mousemove", this.boundMouseMove)

    // right click prevent the menu
    this.canvas.addEventListener("contextmenu", this.boundContextMenu)
  }

  #removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown)
    this.canvas.removeEventListener("mousemove", this.boundMouseMove)

    this.canvas.removeEventListener("contextmenu", this.boundContextMenu)
  }

  #handleMouseMove(evt) {
    this.mouse = this.viewport.getMouse(evt, true)
    const line = getNearestLine(
      this.mouse, 
      this.world.laneGuides, 
      10 * this.viewport.zoom
    )
   if (line) {
    const proj = line.projectPoint(this.mouse)
    if (proj.offset >= 0 && proj.offset <= 1) {
      this.intent = new Stop(
        proj.point,
        line.directionVector(),
        this.world.roadWidth / 2,
        this.world.roadWidth / 2
      )
    } else {
      this.intent = null
    }
   } else {
    this.intent = null
   }
  }

  #handleMouseDown(evt) {
    if (evt.button == 0) { // left click
      if (this.intent) {
        this.markings.push(this.intent)
        this.intent = null
      }
    } 


    if (evt.button == 2) { // right click
      for (let i = 0; i < this.markings.length; i ++) {
        const poly = this.markings[i].poly
        if (poly.containsPoint(this.mouse)) {
          this.markings.splice(i, 1)
          return
        }
      }
    }

    // if (evt.button == 0) { // left click
    //   // the point is exist
    //   if (this.hovered) {
    //     this.#selectPoint(this.hovered)
    //     this.dragging = true
    //     return   
    //   }

    //   // the point is not exist
    //   this.graph.addPoint(this.mouse)
    //   this.#selectPoint(this.mouse)
    //   this.hovered = this.mouse
    // }
  }


 }