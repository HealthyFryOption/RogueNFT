export function throwCustomError(
        message:String, status:Number =500
    ){
    
    // following CustomNextResponseError interface
    throw {
        clientErrorMessage: message,
        status: status 
     }
}