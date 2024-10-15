import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export  function getInptronEngineApiEndPoint():string
{
  console.log('process.env.INPUTRON_ENGINE_API_ENDPOINT', process.env.INPUTRON_ENGINE_API_ENDPOINT);
 // return import.meta.env.INPUTRON_ENGINE_API_ENDPOINT ;
  return process.env.INPUTRON_ENGINE_API_ENDPOINT || "https://api.inputron.com";
}


export function getInputronEngineApiKey():string
{
//   console.log('process.env.INPUTRON_ENGINE_API_ENDPOINT', process.env.INPUTRON_API_KEY);
  return process.env.INPUTRON_API_KEY as string ;
}

export function getBaseUrl():string
{
    return import.meta.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

export function getClientId():string
{
  console.log('process.env.INPUTRON_CLIENT_ID', process.env.INPUTRON_CLIENT_ID);
  return process.env.INPUTRON_CLIENT_ID || "";
}