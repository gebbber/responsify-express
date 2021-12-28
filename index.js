const functions = {

    // Success Responses:
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritative: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    IMUsed: 226,

    // Client Error Responses:
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    NotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    URITooLong: 414,
    UnsupportedMedia: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    HeaderFieldsTooLarge: 431,
    UnavailableForLegal: 451,

    // Server Error Responses:
    InternalError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    VersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthRequired: 511
}

const senders = {};

for (const key in functions) {

    senders[key+functions[key]] = (res, payload) => {
        res.status(functions[key]);
        if (!payload) res.end();
        else if (payload instanceof Error) res.json({error: payload.message});
        else if (typeof payload === 'object') res.json(payload);
        else res.send(String(payload));
    };

}

// app.use(responsify);
const responsify = (req, res, next) => {
    for (const sender in senders) {
        res[sender] = (payload) => {senders[sender](res, payload);};
    }
    if (next && typeof next === 'function') next();
    else throw new Error('Need next()');
}

const middleware = {};

for (const key in functions) {

    middleware[key+functions[key]] = (arg1, arg2) => {
        if (arg2 && arg2.send && arg2.end && arg2.json 
            && typeof arg2.send === 'function' && typeof arg2.end === 'function'
            && typeof arg2.json === 'function') {
            
            //arg1 and arg2 are req, res; send empty response
            senders[key+functions[key]](arg2, null);
        }
        
        else return (req, res) => {
            senders[key+functions[key]](res, arg1);
        };
    };
}

module.exports = {
    responsify: responsify,
    ...middleware
}