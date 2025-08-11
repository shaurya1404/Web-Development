// Understanding the node internals
const fs = require('fs');
const crypto = require('crypto');

process.env.UV_THREADPOOL_SIZE = 2;

setTimeout(() => console.log("Set Timeout", 0));
setImmediate(() => console.log("Set Immediate"));

fs.readFile('index.txt', 'utf-8', (err, data) => {
    setTimeout(() => console.log("Set Timeout in FS", 0));
    setImmediate(() => console.log("Set Immediate in FS"));
    console.log('Hello in FS');

    start = Date.now()

    crypto.pbkdf2('password', 'salt1', 100000, 1024, 'sha512', (err, data) => {
        console.log(`${Date.now() - start}ms: Password 1 Hashed`);
    });
    crypto.pbkdf2('password', 'salt1', 100000, 1024, 'sha512', (err, data) => {
        console.log(`${Date.now() - start}ms: Password 2 Hashed`);
    });
    crypto.pbkdf2('password', 'salt1', 100000, 1024, 'sha512', (err, data) => {
        console.log(`${Date.now() - start}ms: Password 3 Hashed`);
    });
    crypto.pbkdf2('password', 'salt1', 100000, 1024, 'sha512', (err, data) => {
        console.log(`${Date.now() - start}ms: Password 4 Hashed`);
    });
    crypto.pbkdf2('password', 'salt1', 100000, 1024, 'sha512', (err, data) => {
        console.log(`${Date.now() - start}ms: Password 5 Hashed`);
    });
})

console.log('Hello');