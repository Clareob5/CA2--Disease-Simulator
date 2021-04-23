//this subclass is recovered from infection and cant get infected again
class Recovered extends Molecule {
  constructor({
    i,
    px = 200,
    py = 200,
    vx = random(2, -2),
    vy = random(2, -2)
  }) {
    super({
      i,
      px,
      py,
      vx,
      vy
    }); //inherited from molecule superclass
    this.color = color(255, 0, 100);
    this.mask = false;
  }

}
