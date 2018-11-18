import {width, height, PANEL_HEIGHT, DIFICULTIES} from './constants';


class Spot {
  constructor(id) {
    this.id = id;

    this.thereBomb = false;
    this.adjacentBombs = 0; // How many bombs are in ajdacent spots

    this.covered = true;
    this.flagged = false;
    this.neighbors = []; // All adjacent spots instances
    this.dimensions = [0, 0];
  }

  reveal() {
    /* Turn the spot uncovered and return how many spots are uncovered.
    If the spot don't has adjacent bombs, must reveals its neighbors. This action
    can result a cascade operations.
    */

    if (this.covered && !this.flagged) {
      this.covered = false;
      let uncoveredSpots = 1;

      if (this.adjacentBombs === 0) {
        this.neighbors.forEach(neighbor => {
          uncoveredSpots += neighbor.reveal(); // Count how many spots are uncovered
        })
      }
      return uncoveredSpots;
    }
    return 0;
  }

  flag() {
    // Flag the spot if it is covered
    if (this.covered) {
      this.flagged = true;
    }
  }

  get label() {
    // Return the label that represents the spot state
    if (this.flagged) {
      return '🚩';
    }

    if (this.covered) {
      return '';
    }

    if (this.thereBomb) {
      return '💣';
    }

    if (this.adjacentBombs === 0) {
      return '';
    }

    return this.adjacentBombs;
  }

}


class Terrain {
  /*
  Helper object that mounts a grid of spot objects
  */
  constructor() {
    this.spots = [];
    this.dificulty = 1;
    this.bombSpots = 0;
    this.safeSpots = 0;
  }

  reset() {
    /* (Re)makes a grid based on dificulty and the screen size */
    this.spots = [];
    let bombs = [];

    [cols, bombsFactor] = DIFICULTIES[this.dificulty];

    // Calculates the rows quantity and spot size
    let gridHeight = height - PANEL_HEIGHT;
    let spotWidth = width / cols;
    let rows = Math.floor(gridHeight / spotWidth);
    let spotHeight = gridHeight / rows;
    let spots = cols * rows;

    // Defines the bomb positions
    this.bombSpots = Math.floor((spots * bombsFactor) / 100);
    while(bombs.length < this.bombSpots){
      let random = Math.floor(Math.random() * spots);
      if (bombs.some(e => e === random)) continue;
      bombs[bombs.length] = random;
    }

    // Instantiates spots and applies properties
    for (let i=0; i < spots;i++) {
      let spot = new Spot(i);
      spot.dimensions = [spotWidth, spotHeight];

      spot.thereBomb = bombs.some(e => e === i);

      /* The neighbor's context must be made in two steps, because the instantiate
       * of spots are incremental and part of its neighbors aren't created yet:
       *  1. To identify the already neighbors and push to neighbors array;
       *  2. The current spot instance was "a future neighbor" of some spots, but couldn't
       *  push at step 1 because its wasn't instantiated, than must sets it self as neigbor
       *  to them.  
      */   

      // Step 1
      let start = Math.floor(i/cols) * cols;
      let end = (Math.floor(i/cols) + 1) * cols - 1;
      let upRow = start !== 0 ? (i - cols) : null;

      if (upRow) {
        spot.neighbors.push(this.spots[upRow]);
      }
      if (upRow && i > start) {
        spot.neighbors.push(this.spots[upRow - 1]);
      }
      if (upRow && i < end) {
        spot.neighbors.push(this.spots[upRow + 1]);
      }
      if (i > start) {
        spot.neighbors.push(this.spots[i-1]);
      }

      // Step 2
      spot.neighbors.forEach((neighbor) => {        
        neighbor.neighbors.push(spot);
        if (spot.thereBomb && !neighbor.thereBomb) {
          neighbor.adjacentBombs += 1;
        } else if (!spot.thereBomb && neighbor.thereBomb) {
          spot.adjacentBombs += 1;
        }
      });

      this.spots.push(spot);
    }
    this.safeSpots = spots - this.bombSpots;  // Defines how many spots are safe
  }

  changeDificulty() {
    // Change the dificulty of terrain, based on DIFICULTIES constant
    this.dificulty += this.dificulty < (DIFICULTIES.length - 1) ? 1 : -this.dificulty;
  }
}


const getDificultiesLabels = (current) => {
    // Return the label of DIFICULTIES constant items
    let dificulties = DIFICULTIES.map(e => e[2]);
    return {
      current: dificulties[current], 
      options: dificulties.filter(e => e !== dificulties[current]),
    }
}

export {Terrain, getDificultiesLabels};