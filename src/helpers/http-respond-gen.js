export class makeHttpResponse {
  static success({ statusCode, data }) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: statusCode,
      data: JSON.stringify(data),
    };
  }

  static error({ statusCode, errorMessage }) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: statusCode,
      data: {
        success: false,
        errorMessage: JSON.stringify(errorMessage),
      },
    };
  }
}
