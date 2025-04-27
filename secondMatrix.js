class Matrix2 {
  constructor(size = 10) {
    this.size = size;
    this.matrix = [];
    this.seed = 4401;
    this.m = Math.pow(2, 32);
    this.k = 1.0 - 0 * 0.005 - 1 * 0.005 - 0.27;
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

  adjacencyMatrixPower(power) {
    const result = Array.from({ length: this.size }, () =>
      new Array(this.size).fill(0)
    );
    const multiply = (a, b) => {
      const res = Array.from({ length: this.size }, () =>
        new Array(this.size).fill(0)
      );
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          for (let k = 0; k < this.size; k++) {
            res[i][j] += a[i][k] * b[k][j];
          }
        }
      }
      return res;
    };
    let current = this.matrix;
    for (let i = 1; i < power; i++) {
      current = multiply(current, this.matrix);
    }
    return current;
  }

  findPaths(matrix, length) {
    const paths = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (matrix[i][j] > 0) {
          let path = [i];
          if (length === 2) {
            for (let k = 0; k < this.size; k++) {
              if (matrix[j][k] > 0) {
                paths.push([...path, j, k]);
              }
            }
          } else if (length === 3) {
            for (let k = 0; k < this.size; k++) {
              if (matrix[j][k] > 0) {
                for (let l = 0; l < this.size; l++) {
                  if (matrix[k][l] > 0) {
                    paths.push([...path, j, k, l]);
                  }
                }
              }
            }
          }
        }
      }
    }
    return paths;
  }

  reachabilityMatrix() {
    let reach = this.matrix.map((row) => [...row]);
    for (let k = 0; k < this.size; k++) {
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (reach[i][k] && reach[k][j]) {
            reach[i][j] = 1;
          }
        }
      }
    }
    return reach;
  }

  stronglyConnectedMatrix() {
    const reach = this.reachabilityMatrix();
    const transpose = (m) => m[0].map((_, i) => m.map((row) => row[i]));
    const reverseReach = transpose(reach);
    const strong = Array.from({ length: this.size }, (_, i) =>
      Array.from({ length: this.size }, (_, j) =>
        reach[i][j] && reverseReach[i][j] ? 1 : 0
      )
    );
    return strong;
  }

  stronglyConnectedComponents() {
    const strong = this.stronglyConnectedMatrix();
    const visited = new Array(this.size).fill(false);
    const components = [];

    for (let i = 0; i < this.size; i++) {
      if (!visited[i]) {
        const component = [];
        for (let j = 0; j < this.size; j++) {
          if (strong[i][j]) {
            component.push(j);
            visited[j] = true;
          }
        }
        components.push(component);
      }
    }
    return components;
  }

  condensationGraph() {
    const components = this.stronglyConnectedComponents();
    const componentMap = new Array(this.size);
    components.forEach((group, index) => {
      group.forEach((v) => (componentMap[v] = index));
    });
    const condSize = components.length;
    const condMatrix = Array.from({ length: condSize }, () =>
      new Array(condSize).fill(0)
    );

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.matrix[i][j] === 1) {
          const ci = componentMap[i];
          const cj = componentMap[j];
          if (ci !== cj) {
            condMatrix[ci][cj] = 1;
          }
        }
      }
    }
    return condMatrix;
  }

  printResults() {
    this.computeDegrees();
    console.log('Out-degrees:', this.outDegrees);
    console.log('In-degrees:', this.inDegrees);
    console.table(this.matrix);

    console.table(this.adjacencyMatrixPower(2));
    console.table(this.adjacencyMatrixPower(3));

    const paths2 = this.findPaths(this.adjacencyMatrixPower(2), 2);
    const paths3 = this.findPaths(this.adjacencyMatrixPower(3), 3);
    console.log('Paths of length 2:', paths2);
    console.log('Paths of length 3:', paths3);

    console.table(this.reachabilityMatrix());
    console.table(this.stronglyConnectedMatrix());
    console.log(
      'Strongly Connected Components:',
      this.stronglyConnectedComponents()
    );
    console.table(this.condensationGraph());
  }
}

const matrix2 = new Matrix2();
matrix2.matrixGenerate();
matrix2.printResults();
