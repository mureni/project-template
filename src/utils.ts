import * as AppRootPath from "app-root-path";
import { resolve, extname } from "path";
import { existsSync, accessSync, constants } from "fs";

export function escapeRegExp(rxString: string): string { return rxString.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') };
export function clamp(value: number, low: number, high: number): number { return Math.max(low, Math.min(high, value)) };
export function randFrom<T>(array: T[]): T | undefined { return array[Math.floor(Math.random() * array.length)] };

export function env(envVar: string, defaultValue: string = ""): string {
    if (envVar in process.env) return process.env[envVar] as string;
    return defaultValue;
}

export const DEBUG: boolean = env("NODE_ENV", "development") === "development";

const MRXStore: Map<string, RegExp> = new Map<string, RegExp>();
export function MRX(expr: string, flags?: string): RegExp {
   const rxString = escapeRegExp(expr);
   
   if (!MRXStore.has(rxString)) {      
      const rx: RegExp = flags ? new RegExp(rxString, flags) : new RegExp(rxString);
      MRXStore.set(rxString, rx);
      return rx;
   } else {
      return MRXStore.get(rxString) as RegExp;
   }
}

export const rootPath: string = AppRootPath.toString();

export function getPath(pathType: "resources" | "code", file: string = ""): string {
    let finalPath: string;
    let realPath: string;
    if (file.startsWith("/")) file = file.substr(1);
    process.chdir(rootPath);
    
    if (pathType === "code") {
        if (!DEBUG && extname(file).toLowerCase() === ".ts") file = file.replace(/\.ts(x)?$/, ".js$1");
        realPath = DEBUG ? "src" : "dist";
    } else {
        realPath = pathType;
    }
    
    const fullPath = resolve(rootPath, realPath);
    try {
        accessSync(fullPath, constants.R_OK);
    } catch (error: unknown) {
        if (error instanceof Error) throw DEBUG ? error : new Error(`Unable to access path ${fullPath}: ${error.message}`);
        throw new Error(`Unable to access path ${fullPath} ${error}`);
    }
    
    finalPath = (file === "") ? fullPath : resolve(fullPath, file);
    if (!existsSync(finalPath)) throw new Error(`Unable to locate file at path: ${finalPath}`);

    return finalPath;
}





 

