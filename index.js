// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;

const btn = document.getElementById('btn');
btn.addEventListener('click', onClick);

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
  catchChain = [];
  thenChain = [];
  err;
  constructor(callback) {
    const myResolve = (val) => {
      this.res = val;
      this.isResolved = true;
      if (this.thenChain.length) {
        this.thenChain.reduce((acc, thenFunc) => thenFunc(acc), this.res);
      }
    };
    const myReject = (error) => {
      this.err = error;
      this.isRejected = true;
      if (this.catchChain.length) {
        this.catchChain.reduce((acc, catchFunc) => catchFunc(acc), this.err);
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
    this.catchChain.push(errCB);
    if (this.isRejected) {
      this.catchChain.reduce((acc, catchFunc) => catchFunc(acc), this.err);
    }
    return this;
  }

  myFinally(finalCB) {
    this.thenChain.push(finalCB);
    this.catchChain.push(finalCB);
    if (this.isResolved) {
      this.thenChain.reduce((acc, thenFunc) => thenFunc(acc), this.res);
    }
    if (this.isRejected) {
      this.catchChain.reduce((acc, catchFunc) => catchFunc(acc), this.err);
    }
  }
}

let prom4 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve(47);
    reject('Late error');
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
    return res;
  })
  .myCatch((err) => {
    console.log(err);
    return err;
  })
  .myCatch((err) => {
    console.log(err, 'Again');
    return err + 'Final';
  })
  .myFinally((data) => console.log(data, 'Finally'));

// Bind

Function.prototype.myBind = function (...args) {
  const func = this;
  return function (...params2) {
    let params = args.slice(1);
    func.call(args[0], ...params, ...params2);
  };
};

let name = {
  firstName: 'Sakshi',
  lastName: 'Parashar',
};
function myFunc(hometown, country, expertise) {
  console.log(this.firstName, this.lastName, hometown, country, expertise);
}

let myFuncImpl = myFunc.myBind(name, 'Kanpur', 'India');
myFuncImpl('Frontend');

// Bind without call or apply
Function.prototype.myBind2 = function (...args) {
  const func = this;
  return function (...args2) {
    let ctx = args[0];
    ctx.func = func;
    ctx.func(...args.slice(1), ...args2);
  };
};
let animal = {
  name: 'Rocky',
  breed: 'Golden Retriever',
};
function myFunc2(age, gender, weight) {
  console.log(this.name, this.breed, age, gender, weight + 'lbs');
}

const myFunc2Impl = myFunc2.myBind2(animal, 21, 'Male');
myFunc2Impl(70);

// Call
Function.prototype.myCall = function (...args) {
  let ctx = args[0];
  let params = args.slice(1);
  let func = this;

  ctx.func = func;
  ctx.func(...params);
};

let vehicle = {
  wheels: 4,
  category: 'Car',
};

function vehicleDetails(brand, color, price) {
  console.log(this.wheels + 'Wheeler', this.category, brand, color, price);
}

vehicleDetails.myCall(vehicle, 'Maruti', 'Red', '6L');

// apply
Function.prototype.myApply = function (...args) {
  let ctx = args[0];
  let params = args[1];
  let func = this;

  ctx.func = func;
  ctx.func(...params);
};

let vehicle2 = {
  wheels: 4,
  category: 'Car',
};

function vehicleDetails2(brand, color, price) {
  console.log(this.wheels + 'Wheeler', this.category, brand, color, price);
}

vehicleDetails2.myApply(vehicle2, ['Maruti', 'Red', '6L']);

// Throttling
function logClick() {
  console.log('Clicked');
}

function throttle(func, delay) {
  let flag = true; // Maintains a closure to initialize just once
  return function () {
    if (flag) {
      func();
      flag = false;
      setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
}

const betterClick = throttle(logClick, 3000);

// function onClick() {
//   betterClick();
// }

// debounce
function debounce(func, delay) {
  let timer;
  return function () {
    const self = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func();
      // func.apply(self);
    }, delay);
  };
}

const betterClick2 = debounce(logClick, 3000);
function onClick() {
  betterClick2();
}
// Pipe - Executes function in an order with the output of fist function as input to second function and so on
function getName(person) {
  return person.name;
}

function getFirst6Letters(name) {
  return name.substr(0, 6);
}

function reverse(name) {
  return name.split('').reverse().join('');
}

function toUpper(name) {
  return name.toUpperCase();
}

function pipe(...funcs) {
  return function (...args) {
    let res = funcs[0](...args);
    for (let i = 1; i < funcs.length; i++) {
      res = funcs[i](res);
    }
    return res;
  };
}
console.log(
  pipe(getName, toUpper, getFirst6Letters, reverse)({ name: 'SakshiParashar' })
);

// Compose - Opposite of pipe
function compose(...funcs) {
  funcs.reverse();
  return function (args) {
    return funcs.reduce((currArgs, func) => func(currArgs), args);
  };
}
console.log(
  compose(
    reverse,
    getFirst6Letters,
    toUpper,
    getName
  )({ name: 'SakshiParashar' })
);
