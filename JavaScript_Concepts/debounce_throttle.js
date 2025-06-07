// Debounce

function outer(fn, delay) {
    let myId;

    return function (...args) {
        clearTimeout(myId);
        myId = setTimeout(() => {
            fn.apply(this, args);
        }, delay)
    }
}

function greet(name) {
    console.log(`Hello, ${name}!`)
}

const result = outer(() => greet("Shaurya"), 2000);
result();
result();
result();

// Throttling

function throttle (fn, delay) {
    let myId = null

    return function(...args) {
        if(myId === null){
            fn.apply(this, args);
            myId = setTimeout(() => {
                myId = null;
            }, delay)
        }
    }
}

let hello = (() => {console.log("Hello")});

const throttled = throttle(() => (hello()), 3000);

throttled();
throttled();
throttled();
throttled();