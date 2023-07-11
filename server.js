/**
 * This file will only defined once to connect with network of server. All changes needed will be update
 * in src/app.js file
 */


const app = require("./src/app");

const PORT = 3055
const server = app.listen(PORT, () => {
    console.log(`WSW Ecomerce start  with ${PORT}`);
})

process.on('SIGNIN', () => {
    server.close( () => {
        console.log(`Exit server App`);
    })
})