import { useEffect } from "react";

export default function ErrorDialog(
    { message, onClose } : { message: string; onClose: () => void;}
){
    useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 3000); // Hide after 5 seconds
    
        return () => clearTimeout(timer);
      }, [onClose]);

      return (
        <div className="z-200 fixed bottom-5 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
            Error: {message}
        </div>
      )      
}