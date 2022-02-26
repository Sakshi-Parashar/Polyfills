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
