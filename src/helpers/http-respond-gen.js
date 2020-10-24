export class makeHttpResponse {
  static success({ statusCode, data }) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: statusCode,
      data: data,
    };
  }

  static error({ statusCode, errorMessage }) {
    return {
      headers: {
        "Content-Type": "application/json",
        "Application-Error": "Error"
      },
      statusCode: statusCode,
      data: {
        success: false,
        errorMessage: errorMessage,
      },
    };
  }
}
