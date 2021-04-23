class Molecule {
  //superclass made with default parameters
  constructor({i, px=200, py=200,vx=random(1.5,-1.5),vy=random(1.5,-1.5)}) {
    this.pos = createVector(px, py); //random position
    this.velocity = createVector(vx, vy); //random speed
    this.radius = 6; //set radius
    this.color = color(0,255,0); //default colour
    this.index = i; //index of molecule
    this.mask = false;
  }

  //renders molecules to screen by creating ellipses using the position and radius above
  render() {
    noStroke()
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
    fill(obj.textColor);
    (obj.showText) ? (
      textSize(16),
      textAlign(CENTER),
      text(this.index, this.pos.x, this.pos.y + 6)) : null;
  }

  isIntersecting(_ball) {
    //console.log(_ball.pos)
    let resultantV = p5.Vector.sub(this.pos, _ball.pos);
    let distance = dist(this.pos.x, this.pos.y, _ball.pos.x, _ball.pos.y)
    let gap = distance - this.radius - _ball.radius;
    let check = (gap <= 0) ? true : false;

    if (check) {
      this.separate(_ball);
      //pos of the balls when intersecting - used to calculate velocity
      let dx = this.pos.x - _ball.pos.x;
      let dy = this.pos.y - _ball.pos.y;

      let normalX = dx / distance;
      let normalY = dy / distance;

      let dVector = (this.velocity.x - _ball.velocity.x) * normalX;
      dVector += (this.velocity.y - _ball.velocity.y) * normalY;

      let dvx = dVector * normalX;
      let dvy = dVector * normalY;

      dvx = constrain(dvx, -1.5, 1.5)
      dvy = constrain(dvy, -1.5, 1.5)

      this.velocity.x -= dvx;
      this.velocity.y -= dvy;

      _ball.velocity.x += dvx;
      _ball.velocity.y += dvy;

      //  console.log(`this index = ${this.index} Velocity: ${this.velocity.x}`);
    }
    return check;
  }

  separate(_ball) {
    let resultantV = p5.Vector.sub(this.pos, _ball.pos);
    let rHeading = resultantV.heading();
    let rDist = (resultantV.mag() - this.radius - _ball.radius);

    // Here we thake away the calculated distance from the current pos
    let moveX = cos(rHeading) * rDist;
    let moveY = sin(rHeading) * rDist;
    //console.log(moveX);

    this.pos.x -= moveX;
    this.pos.y -= moveY;

    _ball.pos.x += moveX;
    _ball.pos.y += moveY;

    //console.log(`this index = ${this.index} pos of this = ${this.pos.x} pos of _ball = ${_ball.pos.x}`);
    //console.log(`this index = ${this.index} Position in separate = ${this.pos.x}`);
  }

  step() {

    (this.pos.x >= width - this.radius*2 || this.pos.x < this.radius*2) ?
    this.velocity.x *= -1: null;
    console.log(width - this.radius*2);
    (this.pos.y >= (height-300) - (this.radius*2) || this.pos.y < 0 + (this.radius*2)) ?
    this.velocity.y *= -1: null;

    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }
}
