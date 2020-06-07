
/** @type {import("@types/aws-lambda").CloudFrontRequestHandler} */
exports.handler = (event, _, callback) => {
  const { request } = event.Records[0].cf;

  if (request.uri !== '/' && request.uri.endsWith('/')) {
    callback(null, { ...request, uri: `${request.uri}index.html` });
    return;
  }
  callback(null, request);
};
