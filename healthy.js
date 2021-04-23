class Healthy extends Molecule{
  constructor({i, px=200, py=200,vx=random(2,-2),vy=random(2,-2), status="Healthy"}){
  super({i,px,py,vx,vy});

    this.color = color(0,255,0);
    this.status = status;

  }
}
