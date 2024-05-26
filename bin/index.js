#!/usr/bin/env node

const yargs = require("yargs");

const options = yargs
 .usage("Usage: <filename>")
 .option("f", { alias: "name", describe: "file name", type: "string", demandOption: true })
 .argv;

const fs = require("node:fs");
const { execSync} = require("child_process");
console.log(options.name);

var address = process.cwd()+'/'+options.name;

try{
    if(!fs.existsSync(address)){
        fs.mkdirSync(address);
        console.log("created root directory");
    }
   process.chdir(address);
   execSync('npm init -y');
   console.log("initialized project");
   execSync('npm install typescript --save-dev');
   console.log("installed typescript compiler successfully");
   execSync('npm install @types/node --save-dev');
   console.log("type files installed successfully");
   execSync('npx tsc --init --rootDir src --outDir build \
   --esModuleInterop --resolveJsonModule --lib es6 \
   --module commonjs --allowJs true --noImplicitAny true');
  

   let tsConfigObj = {
        compilerOptions: {
            target: "es5",                          
            module: "commonjs",                    
            lib: ["es6"],                     
            allowJs: true,
            outDir: "build",                          
            rootDir: "src",
            strict: true ,         
            noImplicitAny: true,
            esModuleInterop: true,
            resolveJsonModule: true
        }
   }
  
   let writeData = JSON.stringify(tsConfigObj, null, 2);
   console.log(writeData);
   fs.writeFileSync('tsconfig.json',writeData);
   console.log("tsconfig.json configured correctly");
   fs.mkdirSync('src');
   fs.writeFileSync('src/index.ts', `console.log('Hello world')`);
   console.log("created index.ts file in src directory");
   execSync('npm install --save-dev ts-node nodemon');
   let nodemonSettings = {
        watch: ["src"],
        ext: ".ts,.js",
        ignore: [],
        exec: "npx ts-node ./src/index.ts"
   }
    nodemonSettings = JSON.stringify(nodemonSettings, null, 2);
   fs.writeFileSync('nodemon.json',nodemonSettings)

   let data = fs.readFileSync('package.json');
        
    let updatePackage = JSON.parse(data);
    updatePackage.scripts = {
        "start": "tsc",
        "dev": "nodemon"
    }
    updatePackage = JSON.stringify(updatePackage, null, 2);
    fs.writeFileSync('package.json', updatePackage);
    console.log("package.json updated successfully");
} catch (e){
    console.log('Error: ', e);
    process.chdir('..');
    fs.rmdirSync(address, { recursive: true });

}

