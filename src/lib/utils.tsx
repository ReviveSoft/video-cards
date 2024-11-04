import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CustomAgentMap } from "../types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export  function getInptronEngineApiEndPoint():string
{
  //console.log('process.env.INPUTRON_ENGINE_API_ENDPOINT', process.env.INPUTRON_ENGINE_API_ENDPOINT);
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
  //console.log('process.env.INPUTRON_CLIENT_ID', process.env.INPUTRON_CLIENT_ID);
  return process.env.INPUTRON_CLIENT_ID || "";
}

export function getCustomAgentFieldNameMap(): CustomAgentMap {
  const clientId = getClientId();
  console.log("Client ID:", clientId); // Debug log

  if (process.env.InputronCustomAgentFieldMap) {
    try {
      const fieldMap = JSON.parse(process.env.InputronCustomAgentFieldMap);
      console.log("Parsed Field Map:", fieldMap); // Debug log

      // Check if fieldMap has a property for clientId and return it
      if (clientId && fieldMap[clientId]) {
        console.log(`Returning field map for clientId: ${clientId}`, fieldMap[clientId]); // Debug log
        return fieldMap[clientId];
      } else {
        console.warn(`No mapping found for clientId: ${clientId}`);
      }
    } catch (error) {
      console.error("Failed to parse InputronCustomAgentFieldMap:", error);
    }
  } else {
    console.warn("InputronCustomAgentFieldMap environment variable is not set.");
  }

  return {}; // Return empty object if no mapping found
}