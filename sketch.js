///DISCLAIMER
//the simulator is made with the help of real world data, though because some data was hard to come by
//some of the calculations are not accurate to real world situations
//I tried my best to make it accurate but it proved very difficult to get accurate and up to date information
//all probabilities are calculated using a random num function, this isn't the most accurate way but I believe
//it immitates the complexity and non linear structure of covid

///////Recover - two week length////////////
//90% rate to recover normally after two weeks - default set at 420 frames for a week but can be changed
//8% death rate noramlly and 2% go to ICU
//under 60 in ICU
//80% recover and 15% die and 5% stay infected
//over 60 in ICU
//85% die and 10% recover  and 5% stay infected
//if vulnerable
//under 80
//60% recover 10% in ICU and 30% die
//over 80
//80% die and 5% recover rest stay infected

let molecules = [];
let graphArray = [];
let colWidth, rowHeight;
let checkNum = 0;
let percentOfInfected = 0.05;
let recoveryRate = 0.9;
let oneWeek = 420;

function setup() {
  createCanvas(900, 900);
  colWidth = (width - 300) / obj.numCols;
  rowHeight = (height - 300) / obj.numRows;
  console.log(colWidth);
  console.log(rowHeight);
  molecules = [];

  for (let i = 0; i < obj.numOfMolecules; i++) {
    //ceiling the equation as the percentage is a decimal
    let infected = ceil(percentOfInfected * obj.numOfMolecules); //amount of infected molecules based on the percentOfInfected
    let suseptible = ceil(0.04 * obj.numOfMolecules) + infected; //amount of suseptible molecules based on how many people are vulnerable to covid

    //creating the molecules based on the above information
    //creating the rest as healthy molecules
    if (i <= infected) {
      molecules.push(new Infected({
        i: i
      }));
    } else if (i > infected && i <= suseptible) {
      molecules.push(new Healthy({
        i: i,
        status: "Suseptible" // healthy molecule with a status of suseptible
      }));
    } else {
      molecules.push(new Healthy({
        i: i
      }));

    }
  }

  placeMolecules();
  //noLoop();
  checkLoop();
}

function draw() {
  background(255);

  drawGraph(); //draws graph displaying the different types of molecule and how much there are
  textAndKey(); //draws key and text to explain simulator
  populateArrayLShape();
  //grid boolean if turned on in GUI the grid will show on canvas
  obj.gridState ? grid() : null;

  obj.masked ? masks() : null;

  //rendering and stepping(moving) each molecule
  molecules.forEach((molecule) => {
    molecule.render();
    molecule.step();
  });

  //calculating whether or not a molecule will recover or die
  let numInfected = molecules.filter(ball => ball.constructor.name == "Infected")

  numInfected.forEach((molecule) => {
    recoverRate(molecule);
  });
}

//It gets passed a parameter that represents a section of the grid thats in an L shape
//molecules will only check against the others in their section.
//draws a line representing the distance between each ball thats checking against the other.
//calls an infect method that passes both intersecting molecules
function checkIntersections(_collection) {
  for (let a = 0; a < _collection.length; a++) {
    for (let b = a + 1; b < _collection.length; b++) {
      let molA = molecules[_collection[a]];
      let molB = molecules[_collection[b]];
      if (obj.lineState) {
        stroke(125, 100);
        line(molA.pos.x, molA.pos.y, molB.pos.x, molB.pos.y);
      };
      molA.isIntersecting(molB) ? (infect(molA, molB)) : null;
    }
  }
}


  //The following function filters the molecules into groups based on their position and maps those groups to arrays with the ball index.
  //this is done using a nested loop  that iterated through columns(i) within rows(j). Colwidth and rowheight are calculated in the setup.
  //Each filtered array is a grid, when each one is mapped they are merged togeteher into the moleculedComllection array which is then passed to the checkIntersections() method
  //we are mapping three different grids per object to check adjacent grids
  function populateArrayLShape() {
    //console.log("hii");
    checkNum = 0;
    for (let j = 0; j < obj.numRows; j++) {
      for (let i = 0; i < obj.numCols; i++) {

        //filtering the molecules in the grid sqaure beside the one that the current molecule is in
        let adjacentSquare = molecules.filter(molecule =>
          molecule.pos.x > ((i - 1) * colWidth) &&
          molecule.pos.x < (i * colWidth) &&
          molecule.pos.y > (j - 1) * rowHeight &&
          molecule.pos.y < j * rowHeight
        ).map(molecule => molecule.index);


        let adjacentSquareDiagonal = molecules.filter(molecule =>
          molecule.pos.x > ((i - 1) * colWidth) &&
          molecule.pos.x < (i * colWidth) &&
          molecule.pos.y > (j * rowHeight) &&
          molecule.pos.y < (j + 2) * rowHeight
        ).map(molecule => molecule.index);

        let currentSquare = molecules.filter(molecule =>
          molecule.pos.x > (i * colWidth) &&
          molecule.pos.x < ((i + 1) * colWidth) &&
          molecule.pos.y > j * rowHeight &&
          molecule.pos.y < (j + 1) * rowHeight
        ).map(molecule => molecule.index);

        let moleculeCollection = [...currentSquare, ...adjacentSquare, ...adjacentSquareDiagonal];
        //console.log(moleculeCollection);
        checkIntersections(moleculeCollection);
        //console.log(moleculeCollection);

      }
    }

  }

  //masks cause 16% reduction in infection
  function masks() {
    let moleculeMasks = molecules.filter(molecule => molecule.index <= obj.percentMasked * obj.numOfMolecules && molecule.constructor.name != "Dead");
    moleculeMasks.forEach((molecule) => {
      molecule.mask = true;
    });

  }
  //The function gridify assigns
  function placeMolecules() {
    let numDivision = ceil(Math.sqrt(obj.numOfMolecules));
    let spacing = (width - (6 * 2) - 300) / numDivision;
    let centering = spacing / 2;

    molecules.forEach((molecule, index) => {

      let colPos = (index % numDivision) * spacing;
      let rowPos = floor(index / numDivision) * spacing;
      //console.log(`The col pos ${colPos} and the row pos ${rowPos}`);
      molecule.pos.x = colPos + centering;
      molecule.pos.y = rowPos + centering;

    });
  }

  // The function drawGrid draws a grid using a nested loop iterating columns(i)
  // within rows(j). colWidth and rowWidth are calculated in the setup(). The style
  // of grid is defined by fill, stroke and strokeWeight. There
  // are no parameters required to fulfil the function and no returns
  function grid() {

    for (let j = 0; j < obj.numRows; j++) {
      for (let i = 0; i < obj.numCols; i++) {
        stroke(obj.gridLineColor, 50);
        strokeWeight(1);
        line(0, (rowHeight) * j, (height - 300), (rowHeight) * j); // draws the rows
        line((colWidth) * i, 0, (colWidth) * i, (width - 300)); //draws the columns
      }
    }
  }

  //this functions checks to see if the loopState is true or false
  //if true the draw runs
  function checkLoop() {
    if (obj.loopState) {
      loop();
    } else {
      noLoop();
    }
  }
  //using the infection rate in the GUI
  //if an infected molecule intersects with a healthy molecule they are passed to this method
  // have a chance that the healthy will become Infected if the two molecules were one healthy and one infected
  //using the random() function to generate random number betwen 0 and 1
  //if statement with if the number is below the infectionRate num the molecule gets infected.
  //if the mask method is on the chance of infection goes down and triggers the other if statement
  //if infected splice the healthy object and replace it and all its parameters with an infected object
  //nested if statment that if the molecule was suseptible it is now infectedS (vulernable infected)
  function infect(molA, molB) {
    if (molA.constructor.name == "Healthy" && molB.constructor.name == "Infected") {
      let num = random(); //random number
      let i = molA.index;
      //runs if no masks are worn
      if (num <= obj.infectionRate && molA.mask != true) {
        //splice molecule and replace it with infected molecule
        molecules.splice(i, 1, new Infected({
          i: molA.index,
          px: molA.pos.x,
          py: molA.pos.y,
          vx: molA.velocity.x,
          vy: molA.velocity.y
        }));
        if (status == "Suseptible") { //doesnt make you more likely to get infected just makes it harder to recover
          molA.status == "InfectedS"; //hospitalised
        }
      } else if (molA.mask != false) {
        let newInfectionRate = obj.infectionRate - (0.16 * obj.infectionRate)
        //console.log(newInfectionRate);
        if (num <= newInfectionRate) {
          molecules.splice(i, 1, new Infected({
            i: molA.index,
            px: molA.pos.x,
            py: molA.pos.y,
            vx: molA.velocity.x,
            vy: molA.velocity.y
          }));
          if (status == "Suseptible") { //doesnt make you more likely to get infected just makes it harder to recover
            molA.status == "InfectedS"; //hospitalised
          }
        }
      }
    } else if (molB.constructor.name == "Healthy" && molA.constructor.name == "Infected") {
      let num = random();
      let i = molB.index;
      if (num <= obj.infectionRate && molB.mask != true) {
        let status = molA.status;
        molecules.splice(i, 1, new Infected({
          i: molB.index,
          px: molB.pos.x,
          py: molB.pos.y,
          vx: molB.velocity.x,
          vy: molB.velocity.y
        }));
        if (status == "Suseptible") { //doesnt make you more likely to get infected just makes it harder to recover
          molB.status == "InfectedS"; //hospitalised
        } else if (molB.mask != false) {
          let newInfectionRate = obj.infectionRate - (0.16 * obj.infectionRate)
          if (num <= newInfectionRate) {
            molecules.splice(i, 1, new Infected({
              i: molB.index,
              px: molB.pos.x,
              py: molB.pos.y,
              vx: molB.velocity.x,
              vy: molB.velocity.y
            }));
            if (status == "Suseptible") { //doesnt make you more likely to get infected just makes it harder to recover
              molB.status == "InfectedS"; //hospitalised
            }
          }
        }
      }
    }
  }
  
  //Recovery rate method - recovery rate calculated over 3 week cycle
  //first filter all the infected molecules to a separate arrays and cycle through each molecules
  //to get recovery time set a date of birth for each infected molecule and then set a probability
  //of recovering vs dying vs being hospitilised(ICU) based on the length of illness
  //add suseptible to the equation (more likely to be in ICU and die)
  //all calculations done with previously retreived percentages of survivability
  //infectedS - suseptible in hospital
  function recoverRate(molecule) {
    if (frameCount > molecule.birth + obj.infectionLength) {
      let probability = random();
      if (molecule.status == "Infected") {
        if (probability < 0.9) { //0.9 of population
          molecules.splice(molecule.index, 1, new Recovered({
            i: molecule.index,
            px: molecule.pos.x,
            py: molecule.pos.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          }));
        } else if (probability > 0.9 && probability < 0.98) { //0.08 0f the population
          molecules.splice(molecule.index, 1, new Dead({
            i: molecule.index,
            px: molecule.pos.x,
            py: molecule.pos.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          }));
        } else {
          molecule.status = "ICU"
        }
      } else if (molecule.status == "ICU" && molecule.age < 60) {
        if (probability < 0.80) {
          molecules.splice(molecule.index, 1, new Recovered({
            i: molecule.index,
            px: molecule.pos.x,
            py: molecule.pos.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          }));
        } else if (probability > 0.80 && probability < 0.95) { //15% of the population
          molecules.splice(molecule.index, 1, new Dead({
            i: molecule.index,
            px: molecule.pos.x,
            py: molecule.pos.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          }));
        } else {
          console.log("still infected");
        }
      } else if (molecule.status == "ICU" && molecule.age > 60) {
        if (probability < 0.85) {
          molecules.splice(molecule.index, 1, new Dead({
            i: molecule.index,
            px: molecule.pos.x,
            py: molecule.pos.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          }));
        } else if (probability > 0.80 && probability < 0.10) { //10% of the population above 60
          molecules.splice(molecule.index, 1, new Recovered({
            i: molecule.index,
            px: molecule.pos.x,
            py: molecule.pos.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          }));
        } else {
          console.log("still infected");
        }

      } else if (molecule.status == "InfectedS") { //median death rate for suseptible is 80
        if (molecule.age < 80) {
          if (probability <= 0.6) { //not accurate just calculated based on my reading
            molecules.splice(molecule.index, 1, new Recovered({
              i: molecule.index,
              px: molecule.pos.x,
              py: molecule.pos.y,
              vx: molecule.velocity.x,
              vy: molecule.velocity.y
            }));
          } else if (probability > 0.6 && (probability <= 0.7)) {
            molecule.status = "ICU"
          } else {
            molecules.splice(molecule.index, 1, new Dead({
              i: molecule.index,
              px: molecule.pos.x,
              py: molecule.pos.y,
              vx: molecule.velocity.x,
              vy: molecule.velocity.y
            }));
          }
        } else if (molecule.age > 80) {
          if (probability <= 0.80) { //not accurate just calculated based on my reading and calculating averages
            molecules.splice(molecule.index, 1, new Dead({
              i: molecule.index,
              px: molecule.pos.x,
              py: molecule.pos.y,
              vx: molecule.velocity.x,
              vy: molecule.velocity.y
            }));
          } else if (probability > 0.05) { //5% recover
            molecules.splice(molecule.index, 1, new Recovered({
              i: molecule.index,
              px: molecule.pos.x,
              py: molecule.pos.y,
              vx: molecule.velocity.x,
              vy: molecule.velocity.y
            }));
          } else {
            molecule.status = "ICU"; //15% go to ICU
          }

        }
      } else if (frameCount > molecule.birth + oneWeek * 6 && molecule.status == "ICU") { //if you are in ICU for six weeks you have a very high chance of dying
        if (probability < 0.92) {
          molecules.splice(molecule.index, 1, new Dead({
            i: molecule.index,
            px: molecule.pos.x,
            py: molecule.pos.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          }));
        }
      }
    }
  }

  //this function draws a graph showing how many of each type of molecule are in the canvas
  //first the types are filtered to their own array and then the length of the array is mapped and set as the height
  //set the graph to draw over itself when it reached a certain length using array.shift()
  //push the length of each filtered array intothe graphArray along with their dHeightdraw rectangles equal to height of each type
  //(this will be a percentage of the height of the graph)
  //display text stating how many of each molecule are on the canvas
  function drawGraph() {
    let numInfected = molecules.filter(ball => ball.constructor.name == "Infected")
    let numHealthy = molecules.filter(ball => ball.constructor.name == "Healthy")
    let numRecovered = molecules.filter(ball => ball.constructor.name == "Recovered")
    let numDead = molecules.filter(ball => ball.constructor.name == "Dead")
    iHeight = map(numInfected.length, 0, obj.numOfMolecules, 0, 100);
    hHeight = map(numHealthy.length, 0, obj.numOfMolecules, 0, 100);
    rHeight = map(numRecovered.length, 0, obj.numOfMolecules, 0, 100);
    dHeight = map(numDead.length, 0, obj.numOfMolecules, 0, 100);
    //console.log(iHeight);

    textAlign(LEFT, LEFT);
    textSize(12);
    text("Infected: " + numInfected.length + " out of " + obj.numOfMolecules, 440, 640);
    textSize(12);
    text("Healthy: " + numHealthy.length + " out of " + obj.numOfMolecules, 440, 660);
    textSize(12);
    text("Recovered: " + numRecovered.length + " out of " + obj.numOfMolecules, 440, 680);
    textSize(12);
    text("Dead: " + numDead.length + " out of " + obj.numOfMolecules, 440, 700);

    if (graphArray.length >= 400) {
      graphArray.shift();
    }
    graphArray.push({
      numInfected: numInfected.length,
      numHealthy: numHealthy.length,
      numRecovered: numRecovered.length,
      numDead: numDead.length,
      iHeight: iHeight,
      hHeight: hHeight,
      rHeight: rHeight,
      dHeight: dHeight
    })
    //console.log(graphArray);
    push(); //returns new array length
    translate(20, 730) //position the graph
    graphArray.forEach(function(data, index) {
      stroke(255, 125, 0);
      strokeWeight(2);
      rect(index, 0, 1, -data.iHeight)
      stroke(205, 193, 220);
      strokeWeight(2);
      rect(index, -data.iHeight, 1, -data.hHeight)
      stroke(255, 0, 100);
      strokeWeight(2);
      rect(index, -data.iHeight + -data.hHeight, 1, -data.rHeight)
      stroke(0);
      strokeWeight(2);
      rect(index, -data.iHeight + -data.hHeight + -data.rHeight, 1, -data.dHeight)
    })
    pop(); //remove an item from end of the array
  }

  //this function draws the key for the canvas and explains the simulation
  function textAndKey() {
    fill(255, 125, 0);
    ellipse(430, 635, 8, 8);
    fill(205, 193, 220);
    ellipse(430, 655, 8, 8);
    fill(255, 0, 100);
    ellipse(430, 675, 8, 8);
    fill(0);
    ellipse(430, 695, 8, 8);

    stroke(125, 100);
    line(15, 635, 15, 730);
    textSize(10);
    text(100, 1, 630)
    text(75, 2, 655)
    text(50, 2, 680)
    text(25, 2, 705)
    text(0, 4, 730)
    text("Graphical representation of the Molecules in Canvas", 25, 740)

    textSize(15);
    line(650,20,900,20)
    let info ="This simulator is based on COVID-19 and the infection rate and recovery rates that are the default were taken from averages of cases and recovery rates and online data."
    let info2 = "The GUI can be used to change these parameters. The graph below the canvas shows the percentage of each type of molecule on the canvas"
    text('Information about Simulation', 650, 15)
    text(info, 650, 35, 250,100)
    text( info2, 650,150, 250,200)

    noStroke();
    textSize(14);
    text('', 650, 35)
  }
