// A Polyfill is a piece of code which provides a specific modern functionality of JavScript in older versions of browsers

// Q. Write a Polyfill for the .map() method

if(!Array.prototype.myMap) {
    Array.prototype.myMap = function (callback) {
        let arr = new Array(this.length);
        for(i = 0; i < this.length; i++){
            arr[i] = callback(this[i], i);
        }
        return arr
    }
}

let arr = [1, 2, 3, 4, 5]
let mappedArr = arr.myMap((value, index) => value * 2);
console.log(mappedArr);

console.log("\n");

// Q. Write a Polyfill for the .forEach() method

if(!Array.prototype.myForEach) {
    Array.prototype.myForEach = function (callback) {
        for(i = 0; i < this.length; i++){
            callback(this[i], i);
        }
    }
}

let forEachArr = arr.myForEach((value, index) => {console.log(value * 2);})
console.log("\n");

// Q. Write a Polyfill for the .reduce() method

if(!Array.prototype.myReduce) {
    Array.prototype.myReduce = function (callback, init) {
            let acc = init || this[0] // If init != 0, null, undefined, then use init. Else, use this[0]
            const startIdx = (acc == init ? 0 : 1) // Start index to iterate array will depend on whther initial vlaue is given or not
            for(i = startIdx; i < this.length; i++){
                acc = callback(acc, this[i]);
            }
            return acc
        
    }
}

let reduced = arr.myReduce((acc, curr) => acc * curr);
console.log(reduced);

//Q. Write a polyfill for the .filter() function

if(!Array.prototype.myFilter) {
    Array.prototype.myFilter = function (cb) {
        let res = [];
        for(i = 0; i < this.length; i++){
            if(cb(this[i])){
                res.push(this[i]);
            }
        }
        return res
    }
}

let filtered = arr.myFilter((x) => x > 3);
console.log(filtered);
