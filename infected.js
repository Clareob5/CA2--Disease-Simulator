class Infected extends Molecule{
  constructor({i, px=200, py=200,vx=random(2,-2),vy=random(2,-2)}){
  super({i,px,py,vx,vy});
    // this.position = createVector(_x, _y);
    // this.velocity = createVector(_vx, _vy);
    //this.radius = 5;
    this.color = color(255,125,0);
    this.status = "Infected";
    this.birth = frameCount;
  }
}
