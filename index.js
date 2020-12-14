#!/usr/bin/node

const fs = require('fs')
const npm = require('npm')

let pjson = JSON.parse(fs.readFileSync('./package.json'))

pjson.scripts = {
    setup: 'npm i -D @types/node typescript concurrently nodemon'
}
fs.writeFileSync('./package.json', JSON.stringify(pjson, undefined, 2))

npm.load(() => {
    npm.run('setup', () => {
        let pjson = JSON.parse(fs.readFileSync('./package.json'))
        delete pjson.scripts.setup
        pjson.scripts.build = "npx tsc"
        pjson.scripts.start =  "npm run build && node dist/server.js",
        pjson.scripts.dev =  "concurrently \"npm run build -- -w\" \"npx nodemon dist/server.js\"",
        fs.writeFileSync('./package.json', JSON.stringify(pjson, undefined, 2))
    })
})

fs.copyFileSync(__dirname + '/tsconfig.json', './tsconfig.json')
fs.mkdirSync('./src')
fs.mkdirSync('./dist')
