let obj = {
    numOfMolecules: 10
    , numRows: 3
    , numCols: 3
    , showText: false
    , loopState: true
    , gridState: false
    , lineState: false
    , moleculeColor: [0, 255, 0]
    , intersectingColor: [0, 100, 0]
    , minBallSize: 15
    , maxBallSize: 18
};

var gui = new dat.gui.GUI();

gui.remember(obj);

section01 = gui.addFolder('Layout');
section01.add(obj, 'numOfMolecules').min(0).max(2000).step(1).onChange(function () {
    setup();
    draw();
});
section01.add(obj, 'numRows').min(1).max(20).step(1).onChange(function () {
    setup();
    draw();
});
section01.add(obj, 'numCols').min(1).max(20).step(1).onChange(function () {
    setup();
    draw();
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

section02 = gui.addFolder('Design');
section02.add(obj, 'minBallSize').min(1).max(50).step(1).onChange(function () {
    setup();
    draw()
});
section02.add(obj, 'maxBallSize').min(1).max(50).step(1).onChange(function () {
    setup();
    draw()
});
