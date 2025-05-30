// let credentials = {
//     name: "Shaurya",
//     id: "12345",
//     password: "pass789"
// }

// const proxyCreds = new Proxy(credentials, { // Proxy to restrict access to the password property
//     get(target, prop) {
//         if(prop == "password") {
//             throw new Error ("Access Denied! Please try again.")
//         }
//         return target[prop]
//     }
// })

// console.log(proxyCreds.password);

// Q. Enable negative indexing of an array using get and set handlers of the Proxy object
 
let arr = [1, 2, 3 ,4, 5];

function negativeIndex(arr) { // Function to enable negative indexing by returning a Proxy
    return new Proxy(arr, {
        get(target, prop) {
            const index = Number(prop);
            if(index < 0) {
                return target[target.length + index]
            }
            else {return target[index]}
        },
        set(target, prop, value) {
            const index = Number(prop);
            if(index < 0) {
                target[target.length + index] = value;
            }
            else {target[index] = value}
            return true
        }
    })
}

let newArr = negativeIndex(arr);
console.log(newArr[-2]);