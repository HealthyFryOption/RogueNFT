export interface clientSideError{
    message: String,
    status: number
}
export function instanceOfResponse(object: any) {
    // the fields to identify Response obj
    return object.status !== undefined && object.headers !== undefined;
}

export interface CustomNextResponseError{
    clientErrorMessage: String,
    status: number 
}
export function isCustomNextResponseError(object: any) {
    return object.clientErrorMessage !== undefined && object.status !== undefined;
}

export interface NFTDetails {
    tokenId: string;
    level: string;
    class: string;
    xp: string;
    cooldown: string;
}