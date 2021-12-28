# responsify-express

Response functions to provide text, JSON, and empty responses in Express JS

## Quick Start: Basic Use as Middleware Functions:

```javascript
// Import the needed middleware functions:
const { Ok200, NotFound404, Unauthorized401 } = require('responsify-express');

// Pass strings to the functions to send them as strings:
app.get('/', Ok200('<p>Welcome to the very short homepage</p>'));

// Or pass objects (or arrays) to send as JSON:
app.get('/settings', Ok200(mySettingsObject));

// Or send empty responses by executing the functions with no arguments:
app.get('/unimplemented', NotFound404())

// Or provide an Error object: 
app.get('/bad-route', NotAuthorized401(Error('Bad Route!'))) //sends JSON: {"error": "Bad Route!"}

// ...or don't even execute them, just pass them in:
app.get('/admin', Unauthorized401);
```
***
## Quick Start: Basic Use as Response Functions:

Import `responsify` and then `app.use` it before any routes that need the response functions:
```javascript
const { responsify } = require('responsify-express');

app.use(responsify);

app.get('/settings', mySettingsRoute);
```
Then, in the route, you'll find the functions available on the `res` object...
```javascript
function mySettingsRoute(req, res, next) {

    database.lookup({ name: req.body.name })
    .then((foundUser)=>{
    
        if (foundUser) res.Ok200(foundUser.settingsObject);
        else res.NotFound404('User not found');

    })
    .catch((err)=>{

        res.InternalError500(err);

    });

}
```
***
## Quick Start: Function Names for Common Responses:
* ### `Ok200()`
* ### `Created201()`
* ### `Accepted202()`
* ### `BadRequest400()`
* ### `Unauthorized401()`
* ### `Forbidden403()`
* ### `NotFound404()`
* ### `NotAllowed405()`
* ### `NotAcceptable406()`
* ### `InternalError500()`
* ### `ServiceUnavailable503()`
***
## API Details - Adding Functions to the `response` Object:

When `responsify` is used as Express middleware, it  adds the entire set of functions to the `response` object:
```javascript
const { responsify } = require('responsify-express');

app.use(responsify);
```

Functions added to the response object take the form `MessageDescription###`, where:
### `res.MessageDescription###([payload])`
* `MessageDescription` is a description of the HTTP status code; all functions are named in PascalCase
* `###` is the HTTP status code; the status code will be helpful for quick reference when you're writing the front end, and will help you to memorize the codes quickly
* `payload` is an optional payload to be sent

### For optional `payload`:
* If `payload` is an object or array (evaluated using `typeof payload === 'object`), then it is sent as JSON using `res.json(payload)`.
* If `payload` is falsey, then an empty response is sent using `res.end()`.
* Otherwise, the value is sent as a string using `res.send(String(payload))`. (Non-string forms are thus coerced into strings.)

**Note:** When used from the `res` response object, **the functions must be executed to work**.  (See examples below)

### Examples:
```javascript
function myRoute(req, res, next) {
    
    if (!req.body.name) res.BadRequest400('No name specified');
   
    res.Ok200('Request received');    // Send a plain string
    res.Ok200({newName: 'Gertrude'}); // Send an object as JSON
    res.Ok200([user1, user2, user3]); // Send an array as JSON

    res.NotFound404('Content not found'); // Add error message
    res.NotFound404({err: caughtError}); // Add error object
    
    res.NotFound404(""); // These both send empty responses with
    res.NotFound404();   // a 404 status code.

    res.NotFound404; // Doesn't work! (works only when used as middleware)

}
```

***
## API Details - Use of Functions as Express Middleware:

Each function must be imported:

```javascript
const { Ok200, BadRequest400, Unauthorized401, NotFound404 } = require('responsify-express');
```
Functions can then be passed to Express's `app.METHOD`, `router.METHOD`, `app.use`, etc. functions, to give quick in-line responses:

### `app.METHOD(route, MessageDescNNN([payload]));`

* Function names are as described above for the functions added to the `response` object&mdash;PascalCase with appended numeric status codes
* Optional `payload` is sent as a string, object, or empty response, as described above.
* When the response functions are used like this, directly as Express middleware, you can provide an empty response either be executing with no arguments, or by just passing the function without executing it:

```javascript
// These are equivalent:
app.get('/', NotFound404());
app.get('/', NotFound404); //works here, if no response content is required
```

### Examples:
```javascript
const app = express();

    // Settings Routes:
    app.get('/settings', getSettings);
    app.post('/settings', Unauthorized401('Not logged in'));

    app.get('/adminsettings', Unauthorized401('Not available!'));

    // Home page
    app.get('/', homepage);

    // Last resort:
    app.use(NotFound404('Page not found'));

app.listen(3000,()=>console.log("Listening..."));
```

***
## Complete List of Implemented Response Functions

### 200-Series: Successful Responses
* `Ok200`
* `Created201`
* `Accepted202`
* `NonAuthoritative203`
* `NoContent204`
* `ResetContent205`
* `PartialContent206`
* `MultiStatus207`
* `AlreadyReported208`
* `IMUsed226`

### 400-Series: Client Error Responses
* `BadRequest400`
* `Unauthorized401`
* `PaymentRequired402`
* `Forbidden403`
* `NotFound404`
* `NotAllowed405`
* `NotAcceptable406`
* `ProxyAuthRequired407`
* `RequestTimeout408`
* `Conflict409`
* `Gone410`
* `LengthRequired411`
* `PreconditionFailed412`
* `PayloadTooLarge413`
* `URITooLong414`
* `UnsupportedMedia415`
* `RangeNotSatisfiable416`
* `ExpectationFailed417`
* `ImATeapot418`
* `MisdirectedRequest421`
* `UnprocessableEntity422`
* `Locked423`
* `FailedDependency424`
* `TooEarly425`
* `UpgradeRequired426`
* `PreconditionRequired428`
* `TooManyRequests429`
* `HeaderFieldsTooLarge431`
* `UnavailableForLegal451`

### 500-Series: Server Error Responses
* `InternalError500`
* `NotImplemented501`
* `BadGateway502`
* `ServiceUnavailable503`
* `GatewayTimeout504`
* `VersionNotSupported505`
* `VariantAlsoNegotiates506`
* `InsufficientStorage507`
* `LoopDetected508`
* `NotExtended510`
* `NetworkAuthRequired511`