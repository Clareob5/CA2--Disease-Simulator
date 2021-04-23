//this class is used to infect new molecules
class Infected extends Molecule {
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
    });

    this.color = color(255, 125, 0);
    this.status = "Infected"; //status will change depending on type of infected
    this.birth = frameCount; //birth is at what frame was the molecule created at.
    this.age = random(18,99) //most infections only affect adults - everyone in this simulation is an adult
    this.mask = false;
  }
}
