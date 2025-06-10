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


// Q. Write the polyfill for implementing Promises

// It is known that a Promise that is used in-code is an instance (object) of the class Promise

function example() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 4000)
    })
}

// We can conclude the following about a Promise from the above

// 1. A Promise takes a callback as its parameter, or the executor function
// 2. The executor fucntion takes two paramters - resolve and reject
// 3. If the executor function calls resolve:
//      The promise is fulfilled
//      All the .then() callbacks are executed
// 4. If the executor function calls reject:
//      The promise is rejected
//      All the .catch() callabacks are executed
// 5. If .finally() is present, it is when the promise has been settled

class myPromise {
    constructor(executorFn){ // The constcrcutor method is always defined for a class and is always method to be executed when an object of that class is created
        this._state = 'pending'
        this._successCallbacks = [],
        this._rejectCallbacks = [],
        this._finallyCallbacks = [],
        this.value = undefined // storing the context of any paramenter given to the resolver fucntion such that even .then() and .catch() have that conext to execute their callbakcs independently in the 'if' statements

        executorFn(this.resolverFn.bind(this), this.rejecterFn.bind(this)) // As soon as a Promise instance is made, initialize state of the promise as pending and call the executor function
    } // "this" will be required in the above line suc that the context is passed into the resolver/rejecter functions, such as the this._state
    // using .bind(this) such that context is bound resolver/rejecter remember this context even after the global execution context has been deleted

    resolverFn(value) {
        this._state = 'fulfilled'
        this._successCallbacks.forEach((cb) => cb(value));
        this._finallyCallbacks.forEach((cb) => cb(value));
        this.value = value
        return this
    }

    rejecterFn(value) {
        this._state = 'rejected',
        this._rejectCallbacks.forEach((cb) => cb(value));
        this._finallyCallbacks.forEach((cb) => cb(value));
        this.value = value
        return this
    }

    then(cb) {
        if(this._state == 'fulfilled'){ // handling edge case where promise is rejected before the .then() statements are read
            cb(this.value);
            return this
        }
        this._successCallbacks.push(cb);
        return this
    }

    catch(cb) {
        if(this._state == 'rejected'){ // handling edge case where promise is rejected before the .catch() statements are read
            cb(this.value);
            return this
        }
        this._rejectCallbacks.push(cb);
        return this
    }
    finally(cb) {
        if(this._state !=  'pending'){
            cb(this.value);
            return this
        }
        this._finallyCallbacks.push(cb)
        return this
    }
}

function wait(seconds) {
    return new myPromise((resolve, reject) => {
        setTimeout(() => resolve(), seconds * 1000)
    })
}

wait(5).then(() => console.log("resolved in 5 seconds"));
