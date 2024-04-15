export const httpStatusToText = (status: number): string => {
  switch (status) {
    case 204: return "No content";
    case 400: return "Bad request, please check your input";
    case 401: return "Unauthorized to access this resource";
    case 403: return "Forbidden to access this resource";
    case 404: return "Resource not found";
    case 405: return "Method not allowed";
    case 500: return "Internal server error";
    default: return `The interwebs might be broken (error code: ${status})`;
  }
};
