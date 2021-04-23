class Recovered extends Molecule{
  constructor({i, px=200, py=200,vx=random(2,-2),vy=random(2,-2)}){
  super({i,px,py,vx,vy});
    this.color = color(255,0,255);
    this.status = "Recovered";
  }

}
