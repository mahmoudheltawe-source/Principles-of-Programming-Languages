//Q1
export function all<T>(promises : Array<Promise<T>>) : Promise<Array<T>> {

  return new Promise<T[]>( (resolve, reject) => {
    let results: T[] = [];
    let completed = 0;
    const total = promises.length;

    if (total === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      promise.then(result => {
          results[index] = result;
          completed++;
          if (completed === total) {
            resolve(results);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  });
}

  
// Q2
export function* Fib1() {
let x = 1;
let y = 1;
while (true) {
  yield x;
  const z = x + y;
  x = y; 
  y = z; 
 
}

}


export function* Fib2() {
  const sqrt5 = Math.sqrt(5);
  const x = (1 + sqrt5) / 2;
  const y = (1 - sqrt5) / 2;
  let n = 1;
  while (true) {
    const fibN = (Math.pow(x, n) - Math.pow(y, n)) / sqrt5;
    yield Math.round(fibN);
    n++;
  }
}
