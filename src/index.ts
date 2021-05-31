import "dotenv/config";
import * as Utils from "./utils";


/* Examples of using some pre-built utilities */
console.log(`
    Debug (developer) Environment?: ${Utils.DEBUG} (NODE_ENV: ${Utils.env("NODE_ENV")})
    Running project name: ${Utils.env("PROJECT_NAME")}    
    Application root path: ${Utils.rootPath}
    Path of index: ${Utils.getPath("code", "index.ts")}    
`);

/* Example of using VS Code Debug breakpoints and logging only in a dev-environment */
Utils.DEBUG && console.log(`This line will set a debug breakpoint.`);
