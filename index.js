// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;

var arr = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
console.log(arr);

// ForEach
Array.prototype.myForEach = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);
  }
};

arr.myForEach((el, i, arr) => {
  console.log(el);
});

// Map
Array.prototype.myMap = function (callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

console.log(arr.myMap((el) => el + 100));
console.log(arr);

// Filter
Array.prototype.myFilter = function (callback) {
  var result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

console.log(arr.myFilter((el) => el >= 3));

// Find
Array.prototype.myFind = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return this[i];
    }
  }
};

console.log(arr.myFind((el) => el > 1));

// Reduce - Important
Array.prototype.myReduce = function (callback, initializer) {
  let acc = initializer;
  for (let i = 0; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};
console.log(
  arr.myReduce((total, el) => {
    return total * el;
  }, 1)
);

// Promise.all
// Very very important
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    let resolved = 0;
    let values = [];
    promises.forEach((promise, idx) => {
      promise
        .then((res) => {
          resolved++;
          values[idx] = res;
          if (resolved === promises.length) {
            resolve(values);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

let prom1 = new Promise((resolve, reject) => resolve(42));
let prom2 = new Promise((resolve) => resolve(15));
let prom3 = new Promise((resolve, reject) => reject('Error'));
Promise.myAll([prom1, prom2, prom3])
  .then((values) => console.log('Resolved', values))
  .catch((err) => console.log(err));

// Promise Implementation - very very important
class MyPromise {
  res;
  isResolved = false;
  isRejected = false;
  catchFunc;
  finallyFunc;
  thenChain = [];
  err;
  constructor(callback) {
    const myResolve = (val) => {
      this.res = val;
      this.isResolved = true;
      if (this.thenChain.length) {
        this.thenChain.reduce((acc, thenFunc) => thenFunc(acc), this.res);
      }
      if (typeof this.finallyFunc === 'function') {
        this.finallyFunc();
      }
    };
    const myReject = (error) => {
      this.err = error;
      this.isRejected = true;
      if (typeof this.catchFunc === 'function') {
        this.catchFunc(this.err);
      }
      if (typeof this.finallyFunc === 'function') {
        this.finallyFunc();
      }
    };
    callback(myResolve, myReject);
  }

  myThen(responseCB) {
    this.thenChain.push(responseCB);
    if (this.isResolved) {
      this.thenChain.reduce((acc, thenFunc) => thenFunc(acc), this.res);
    }
    return this;
  }

  myCatch(errCB) {
    this.catchFunc = errCB;
    if (this.isRejected) {
      this.catchFunc(this.err);
    }
    return this;
  }

  myFinally(finalCB) {
    this.finallyFunc = finalCB;
    if (this.isResolved || this.isRejected) {
      this.finallyFunc();
    }
  }
}

let prom4 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(47);
  }, 1000);
  // reject('Error 404');
});
prom4
  .myThen((res) => {
    console.log(res);
    return res + 2;
  })
  .myThen((res) => {
    console.log(res);
    return res * 2;
  })
  .myThen((res) => {
    console.log(res);
  })
  .myCatch((err) => console.log(err))
  .myFinally(() => console.log('Finally'));
