export const wrapAsync = (fn) => {
    return function (req, res, next) {
      fn(req, res, next).catch(next);
    };
  }

  export const loggingMiddleware = (request, response, next)=>{
    console.log(`${request.method} - ${request.url}`)
    next() //run the next code after middleware essentially
}