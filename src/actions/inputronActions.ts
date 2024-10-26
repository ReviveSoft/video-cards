'use server'
import { getInptronEngineApiEndPoint, getClientId, getInputronEngineApiKey } from '../lib/utils';
import { EnhanceAPIPayloadType, SuggestAPIPayloadType, PredictTextPayloadType, TranslateAPIPayloadType, InvokeAPIPayloadType } from '../types';

export async function invokeActions(payload: InvokeAPIPayloadType) {
    const backendServer = getInptronEngineApiEndPoint();
   
    const { inputText, spiceitup, agentId, number_of_lines } = payload;
    const endpoint = `${backendServer}/v1/prompts/${agentId}/invoke`;
    try {
        console.log("Please log creds", endpoint, getInputronEngineApiKey(), getClientId())
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": getInputronEngineApiKey() || '',
                "client-id": getClientId() || '',
                "cache-control": "no-cache",
                "pragma": "no-cache",
            },
            body: JSON.stringify({
                userPrompt: inputText,
                spiceItUp: spiceitup || true,
                minumumLines: number_of_lines || "1"
            }),
        });
        // console.log('res ->', res.status);

        if (res.status === 200) {
            const data: { data: { message?: string }, error?: string } = await res.json();
            // console.log('returning data', data);
            return data;
        }

        console.log('error', res);
        return { data:{message:''}, error: 'UNABLE TO CONNECT TO SERVER ( Reason  = ' + res.statusText + ')' };

    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    catch (e: unknown) {
        console.log('error', e);

        return { data:{message:''}, error: 'UNABLE TO CONNECT TO SERVER ( Reason  = ' + e + ')' };

    }

}

export async function enhanceAction(payload: EnhanceAPIPayloadType) {
    const backendServer = getInptronEngineApiEndPoint();
    const endpoint = `${backendServer}/v1/enhance`;
    const { inputText, promptOverride, spiceitup } = payload;
    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": getInputronEngineApiKey() || '',
                "client-id": getClientId() || '',
                "cache-control": "no-cache",
                "pragma": "no-cache",
            },
            body: JSON.stringify({
                user: 'yacine',
                text: inputText,
                spiceitup: spiceitup || true,
                number_of_lines: "one",
                additionalPrompt: promptOverride
            }),
        });
        // console.log('res ->', res.status);

        if (res.status === 200) {
            const data: { data: { message?: string }, error?: string } = await res.json();
            // console.log('returning data', data);
            return data;
        }

        console.log('error', res);
        return { data:{message:''}, error: 'UNABLE TO CONNECT TO SERVER ( Reason  = ' + res.statusText + ')' };

    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    catch (e: unknown) {
        console.log('error', e);

        return { data:{message:''}, error: 'UNABLE TO CONNECT TO SERVER ( Reason  = ' + e + ')' };

    }

}


export async function suggestionAction(payload: SuggestAPIPayloadType) {
    // console.log('calling suggestionAction from server?');
    const { list } = payload;
    const backendServer = getInptronEngineApiEndPoint();
    const endpoint = `${backendServer}/v1/suggest`;
    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": getInputronEngineApiKey() || '',
                "client-id": getClientId() || '',
                "cache-control": "no-cache",
                "pragma": "no-cache",
            },
            body: JSON.stringify({
                list,
            }),
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await res.json();
        // console.log('data', data);
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
        console.log('error', e);
        return { error: 'UNABLE TO CONNECT TO SERVER' };
    }
}

export async function translateAction(payload: TranslateAPIPayloadType) {
    // console.log('calling translateAction from server?');
    const { text, languages } = payload;
    const backendServer = getInptronEngineApiEndPoint();
    const endpoint = `${backendServer}/v1/translate`;
    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": getInputronEngineApiKey() || '',
                "client-id": getClientId() || '',
                "cache-control": "no-cache",
                "pragma": "no-cache",
            },
            body: JSON.stringify({
                text,
                languages
            }),
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await res.json();
        // console.log('data', data);
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
        console.log('error', e);
        return { error: 'UNABLE TO CONNECT TO SERVER' };
    }
}

export async function predictTextAction(payload: PredictTextPayloadType) {

    const backendServer = getInptronEngineApiEndPoint();
    const endpoint = `${backendServer}/v1/predict`;
    const { text } = payload;
    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": getInputronEngineApiKey() || '',
                "client-id": getClientId() || '',
                "cache-control": "no-cache",
                "pragma": "no-cache",
            },
            body: JSON.stringify({
                text: text,
            }),
        } );
         const response  = await res.json();
        const data: { data: { message?: string }, error?: string | null } = response;
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
        console.log('error while calling predict api', e);
        return {data:{message:''}, error: 'UNABLE TO CONNECT TO SERVER' };
    }
}


export async function selectronAction(payload: SuggestAPIPayloadType) {
    const { list } = payload;
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": getInputronEngineApiKey() || '',
        "client-id": getClientId() || ''
    };

    const backendServer = getInptronEngineApiEndPoint();
    const endpoint = `${backendServer}/v1/suggest`;
    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: headers,

            body: JSON.stringify({
                list: list
            }),
        });
        const data: SelectronResponseType = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
       // return [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "System" }];
 
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
        console.log('error', e);
        return { error: 'UNABLE TO CONNECT TO SERVER' };
    }
}



type SelectronResponseType = {
    data: {
        list: Array<Array<{
            value: string;
            id: string;
        } | string>>;
    };
    error: string;
} | { message: string };
