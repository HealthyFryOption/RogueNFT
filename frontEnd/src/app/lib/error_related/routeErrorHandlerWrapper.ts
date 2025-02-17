import { NextRequest, NextResponse } from "next/server";
import { instanceOfResponse, CustomNextResponseError, isCustomNextResponseError } from "@/app/lib/typeInterface";

export function errorHandlerWrapper(
  internalErrorMessage: String,
  reqFunction: (req: NextRequest) => Promise<NextResponse>, 
) {
    return async (req: NextRequest): Promise<NextResponse> => {
      // NOTE: NEXTJS route expects an asynchronous function that accept a NextRequest object or no param
      // and return a NextResponse. Ensure the wrapper returns a function that follows such restrictions

      try {
        return await reqFunction(req);
      } catch (error) {
          if(instanceOfResponse(error)){
            // interface checking to ensure it is a response obj, thus a fetch error from backend server (fetchAPIJSON function)
            // catch clause is inherently any or unknown. Thus Typecast to be able to use .status and message
            const apiError = error as Response;

            let errorJSON = await apiError.json()
            let errorMsg
            if(errorJSON.message){
                // backend standard to send errors in "message" field
                errorMsg = errorJSON.message
            }else{
                errorMsg = JSON.stringify(errorJSON)
            }

            console.error(`[ BACKEND REQUEST ERROR - ${apiError.status} ]: ${errorMsg}`);
      
            if (apiError.status >= 400 && apiError.status <= 499){
              return NextResponse.json(
                { message: errorMsg },
                { status: apiError.status },
              );
            }else{
              // return internalErrorMessage, as to not let client know backend internal runtime error
              return NextResponse.json(
                { message: internalErrorMessage },
                { status: 500 },
              );
            }
      
          }else if(isCustomNextResponseError(error)){
            // Custom Error Obj from reqFunction
            const customError = error as CustomNextResponseError

            console.error(`[ ROUTE CUSTOM ERROR - ${customError.status} ]: ${customError.clientErrorMessage}`);

            return NextResponse.json(
              { message: customError.clientErrorMessage },
              { status: customError.status },
            );
          }else{
            // Log Runtime Error
            console.error(`[ ROUTE RUNTIME ERROR ]\n ${error} `);

            // error occured during runtime, return server failed info 
            return NextResponse.json(
              { message: internalErrorMessage },
              { status: 500 },
            );
          }
        }
    };
  }
  