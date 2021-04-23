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
    this.status = "Infected";
    this.birth = frameCount;
    this.age = random(18,99) //most infections only affect adults
  }
}
