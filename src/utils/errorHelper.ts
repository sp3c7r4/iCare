class errorHelper {
  static returnErrorLog(err: any) {
    return {
      message: err.toString(),
      stack: err.stack,
    };
  }
}
export default errorHelper;
