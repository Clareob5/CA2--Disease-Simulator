let obj = {
    numOfMolecules: 100,
    numRows: 12,
    numCols: 12,
    showText: false,
    loopState: true,
    gridState: false,
    lineState: false,
    masked: false,
    textColor: [0, 0, 0],
    backgroundColor: [50, 50, 50],
    gridLineColor: [62, 180, 203],
    ballSpeedX: 2,
    ballSpeedY: -2,
    infectionRate: 0.1,
    weeksOfSimulation: 2,
    percentMasked: 0.5
};

var gui = new dat.gui.GUI();

gui.remember(obj);

section01 = gui.addFolder('Layout');
section01.add(obj, 'numRows').min(1).max(20).step(1).onChange(function () {
    setup();
});
section01.add(obj, 'numCols').min(1).max(20).step(1).onChange(function () {
    setup();
});
section01.add(obj, 'showText').onChange(function () {
    draw()
});
section01.add(obj, 'loopState').onChange(function () {
    checkLoop()
});
section01.add(obj, 'gridState').onChange(function () {
    draw()
});
section01.add(obj, 'lineState').onChange(function () {
    draw()
});

section02 = gui.addFolder('Molecules'); //folder containing all my ball methods
section02.add(obj, 'numOfMolecules').min(0).max(400).step(1).onChange(function () {
    setup();
    draw();
});
section02.add(obj, 'ballSpeedX').min(0.25).max(2).step(0.25).onChange(function() {
  setup();
  draw()
});
section02.add(obj, 'ballSpeedY').min(-0.25).max(-2).step(0.25).onChange(function() {
  setup();
  draw()
});
section02.add(obj, 'infectionRate').min(0.01).max(1).step(0.02).onChange(function() {
  setup();
  draw()
});
section02.add(obj, 'percentMasked').min(0.01).max(1).step(0.02).onChange(function() {
  setup();
  draw()
});
section02.add(obj, 'masked').onChange(function () {
    draw()
});
section03 = gui.addFolder('Colour');
section03.addColor(obj, 'backgroundColor').onChange(function() {
  draw()
});
section03.addColor(obj, 'gridLineColor').onChange(function() {
  setup();
  draw()
});
section03.addColor(obj, 'textColor').onChange(function() {
  setup();
  draw()
});
