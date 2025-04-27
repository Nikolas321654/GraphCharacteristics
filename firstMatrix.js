class Matrix1 {
  constructor(size = 10) {
    this.size = size;
    this.matrix = [];
    this.seed = 4401;
    this.m = Math.pow(2, 32);
    this.k = 1.0 - 0 * 0.01 - 1 * 0.01 - 0.3;
    this.inDegrees = new Array(size).fill(0);
    this.outDegrees = new Array(size).fill(0);
  }

  random() {
    this.seed = (1103515245 * this.seed + 12345) % this.m;
    const randomNum = (this.seed / this.m) * 2;
    return randomNum;
  }

  matrixGenerate() {
    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        let val = this.random() * this.k;
        row.push(val < 1 ? 0 : 1);
      }
      this.matrix.push(row);
    }
  }

  computeDegrees() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.matrix[i][j] === 1) {
          this.outDegrees[i]++;
          this.inDegrees[j]++;
        }
      }
    }
  }

  isRegular() {
    const allDegrees = this.inDegrees.map((deg, i) => deg + this.outDegrees[i]);
    const first = allDegrees[0];
    return allDegrees.every((deg) => deg === first) ? first : null;
  }

  getIsolatedAndPendantVertices() {
    const isolated = [];
    const pendant = [];

    for (let i = 0; i < this.size; i++) {
      const degree = this.inDegrees[i] + this.outDegrees[i];
      if (degree === 0) {
        isolated.push(i);
      } else if (degree === 1) {
        pendant.push(i);
      }
    }

    return { isolated, pendant };
  }

  printResults() {
    console.table(this.matrix);
    console.log('Out-degrees:', this.outDegrees);
    console.log('In-degrees:', this.inDegrees);

    const regularity = this.isRegular();
    if (regularity !== null) {
      console.log(`Graph is regular with degree ${regularity}`);
    } else {
      console.log('Graph is not regular');
    }

    const { isolated, pendant } = this.getIsolatedAndPendantVertices();
    console.log('Isolated vertices:', isolated);
    console.log('Pendant vertices:', pendant);
  }
}

const matrix1 = new Matrix1();
matrix1.matrixGenerate();
matrix1.printResults();
