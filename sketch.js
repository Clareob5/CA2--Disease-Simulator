///DISCLAIMER
//the simulator is made with the help of real world data, though because some data was hard to come by
//some of the calculations are not accurate to real world situations
//I tried my best to make it accurate but it proved very difficult to get accurate and up to date information

let molecules = [];
let grid = [];
let graphArray = [];
let colWidth, rowHeight;
let checkNum = 0;
let percentOfInfected = 0.01;
let oneWeek = 420;

function setup() {
  createCanvas(500, 800);
  colWidth = width / obj.numCols;
  rowHeight = (height - 300) / obj.numRows;
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

  gridify();
  checkLoop();
}

function draw() {

  background(255);

  drawGraph(); //draws graph displaying the different types of molecule and how much there are
  splitObjectIntoGrid();
  //grid boolean if turned on in GUI the grid will show on canvas
  obj.gridState ? drawGrid() : null;

  //rendering and stepping(moving) each molecule
  molecules.forEach((molecule) => {
    molecule.render();
    molecule.step();
  });

  //calculating whether or not a molecule will recover or die
  recoverordie()
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

//using the infection rate mentioned above
//if an infected molecule intersects with a healthy molecule have a chance that the healthy will become Infected
//using the random() function.
//if infected splice the healthy object and replace it and all its parameters with an infected molecule
//nested if statment that if the molecule was suseptible it is now infectedS
function infect(molA, molB) {
  if (molA.constructor.name == "Healthy" && molB.constructor.name == "Infected") {
    let num = random();
    console.log(num)
    let i = molA.index;
    if (num <= 0.08) {
      let status = molA.status;
      molecules.splice(i, 1, new Infected({
        i: molA.index,
        px: molA.pos.x,
        py: molA.pos.y,
        vx: molA.velocity.x,
        vy: molA.velocity.y
      }));
      if (status == "Suseptible") {
        molA.status == "InfectedS";
      }
    }
  } else if (molB.constructor.name == "Healthy" && molA.constructor.name == "Infected") {
    let num = random();
    let i = molB.index;
    if (num <= 0.08) {
      let status = molA.status;
      molecules.splice(i, 1, new Infected({
        i: molB.index,
        px: molB.pos.x,
        py: molB.pos.y,
        vx: molB.velocity.x,
        vy: molB.velocity.y
      }));
      if (status == "Suseptible") {
        molA.status == "InfectedS";
      }
    }
  }
}

//Recover or die method (lil morbid) - recovery rate calculated over 3 week cycle
//first filter all the infected molecules to a separate arrays and cycle through each molecules
//to get recovery time set a date of birth for each infected molecule and then set a probability
//of recovering vs dying vs being hospitilised(ICU) based on the length of illness
//add suseptible to the equation (more likely to be in ICU and die)
//all calculations done with previously retreived percentages of survivability
function recoverordie() {
  let numInfected = molecules.filter(ball => ball.constructor.name == "Infected")
  numInfected.forEach((molecule) => {
    if (frameCount > molecule.birth + oneWeek && molecule.status != "ICU") {
      let probability = random();
      if (probability < 0.6) {
        molecules.splice(molecule.index, 1, new Recovered({
          i: molecule.index,
          px: molecule.pos.x,
          py: molecule.pos.y,
          vx: molecule.velocity.x,
          vy: molecule.velocity.y
        }));
      } else if (frameCount > molecule.birth + oneWeek && molecule.status != "ICU" && molecule.status == "infectedS") {
        if (probability < 0.4) { //this probability was taken from reading but it isn't accurate
          molecules.splice(molecule.index, 1, new Recovered({
            i: molecule.index,
            px: molecule.pos.x,
            py: molecule.pos.y,
            vx: molecule.velocity.x,
            vy: molecule.velocity.y
          }));
        } else if(probability < 0.4){
          molecule.status = "ICU"
        }

      } else{
        molecule.status = "ICU"
        console.log(molecule.status);

      }
    } else if (frameCount > molecule.birth + oneWeek * 2) {
      let probability = random();
      if (probability < 0.5) {
        molecules.splice(molecule.index, 1, new Recovered({
          i: molecule.index,
          px: molecule.pos.x,
          py: molecule.pos.y,
          vx: molecule.velocity.x,
          vy: molecule.velocity.y
        }));
      } else if (probability > 0.5 && probability < 0.8) {
        molecule.status = "ICU"
        console.log(molecule.status);

      } else if (probability > 0.8) {
        molecules.splice(molecule.index, 1, new Dead({
          i: molecule.index,
          px: molecule.pos.x,
          py: molecule.pos.y,
          vx: molecule.velocity.x,
          vy: molecule.velocity.y
        }));
        console.log("DIED");
      } else {
        console.log("Still Infected");
      }

    } else if (frameCount > molecule.birth + oneWeek * 6) {
      let probability = random();
      if (probability < 0.2) {
        molecules.splice(molecule.index, 1, new Recovered({
          i: molecule.index,
          px: molecule.pos.x,
          py: molecule.pos.y,
          vx: molecule.velocity.x,
          vy: molecule.velocity.y
        }));
      } else {
        molecules.splice(molecule.index, 1, new Dead({
          i: molecule.index,
          px: molecule.pos.x,
          py: molecule.pos.y,
          vx: molecule.velocity.x,
          vy: molecule.velocity.y
        }));
        console.log('dead');

      }
    }
  })
}
//////////Suseptible code bit/////////////
// if (molA.status = "ICU" && molA.birth + 400 > frameCount) {
//   molecules.splice(molA.index, 1, new Dead({
//     i: molA.index,
//     px: molA.pos.x,
//     py: molA.pos.y,
//     vx: molA.velocity.x,
//     vy: molA.velocity.y
//   }));
//   console.log("molA is dead")
// }

//The following function filters the molecules into groups based on their position and maps those groups to arrays with the ball index.
//this is done using a nested loop  that iterated through columns(i) within rows(j). Colwidth and rowheight are calculated in the setup.
//Each filtered array is a grid, when each one is mapped they are merged tpgetehr into the moleculedComllection array which is then passed to the checkIntersections() method
function splitObjectIntoGrid() {
  console.log("hii");
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
        console.log(moleculeCollection);
      checkIntersections(moleculeCollection);
      console.log(moleculeCollection);

    }
  }

}

//The function gridify assigns
function gridify() {
  let numDivision = ceil(Math.sqrt(obj.numOfMolecules));
  let spacing = (width - (obj.minBallSize * 2)) / numDivision;
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
function drawGrid() {
  noFill();
  stroke(155, 155, 155, 50);
  strokeWeight(1);

  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {
      //
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight)
    }
  }
}

function checkLoop() {
  if (obj.loopState) {
    loop();
  } else {
    noLoop();
  }
}

function drawGraph() {
  let numInfected = molecules.filter(ball => ball.constructor.name == "Infected")
  let numHealthy = molecules.filter(ball => ball.constructor.name == "Healthy")
  let numRecovered = molecules.filter(ball => ball.constructor.name == "Recovered")
  let numDead = molecules.filter(ball => ball.constructor.name == "Dead")
  iHeight = map(numInfected.length, 0, obj.numOfMolecules, 0, 100);
  hHeight = map(numHealthy.length, 0, obj.numOfMolecules, 0, 100);
  jHeight = map(numRecovered.length, 0, obj.numOfMolecules, 0, 100);
  kHeight = map(numDead.length, 0, obj.numOfMolecules, 0, 100);

  textAlign(RIGHT, RIGHT);
  textSize(12);
  text("Infected: " + numInfected.length + " out of " + obj.numOfMolecules, 200, 810);
  textSize(12);
  text("Healthy: " + numHealthy.length + " out of " + obj.numOfMolecules, 200, 830);
  textSize(12);
  text("Recovered: " + numRecovered.length + " out of " + obj.numOfMolecules, 200, 850);
  textSize(12);
  text("Dead: " + numDead.length + " out of " + obj.numOfMolecules, 200, 870);

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
    jHeight: jHeight,
    kHeight: kHeight
  })
  //console.log(graphArray);
  push();
  translate(0, 800)
  graphArray.forEach(function(data, index) {
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(index, 0, 1, -data.iHeight)
    stroke(0, 255, 0);
    strokeWeight(2);
    rect(index, -data.iHeight, 1, -data.hHeight)
    stroke(255, 0, 255);
    strokeWeight(2);
    rect(index, -data.iHeight + -data.hHeight, 1, -data.jHeight)
    stroke(0);
    strokeWeight(2);
    rect(index, -data.iHeight + -data.hHeight + -data.jHeight, 1, -data.kHeight)
  })
  pop();
}


// } else if (probability > 0.9) {
//   molecules.splice(molecule.index, 1, new Dead({
//     i: molecule.index,
//     px: molecule.pos.x,
//     py: molecule.pos.y,
//     vx: molecule.velocity.x,
//     vy: molecule.velocity.y
//   }));
//   let count = random();
//   if(count > 0.2){
//     molecules.splice(molA.index, 1, new Recovered({
//       i: molB.index,
//       px: molB.pos.x,
//       py: molB.pos.y,
//       vx: molB.velocity.x,
//       vy: molB.velocity.y
//     }));
//   }
// }else if(molA.constructor.name == "Infected"){
// let count = random();
// if(count > 0.2){
//   molecules.splice(molA.index, 1, new Recovered({
//     i: molA.index,
//     px: molA.pos.x,
//     py: molA.pos.y,
//     vx: molA.velocity.x,
//     vy: molA.velocity.y
//   }));
// }
// }
// }
