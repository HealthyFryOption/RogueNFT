export function clientErrorHandlerWrapper<T>(
    asyncFunction: () => Promise<T | null>,
    setErrorMessage: (message: string | null) => void
  ): () => Promise<T | null> {
    return async () => {
      try {
        return await asyncFunction();
      } catch (error) {
        console.log(error)
        setErrorMessage(error instanceof Error ? error.message ?? "Unexpected Error, Message not found.": "An unexpected error occurred.");
        return null;
      }
    };
  }
  