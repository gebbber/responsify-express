const express = require('express');

const app = express();

const { responsify, Ok200, Unauthorized401, NotFound404 } = require('./index');

app.use(responsify);

// Settings Routes:
app.get('/settings', getSettings);
app.post('/settings', Unauthorized401('Not logged in'));

app.get('/systemsettings', Unauthorized401);

// Home page
app.get('/', homepage);

// Last resort:
app.use(NotFound404('Page not found'));

app.listen(3000,()=>console.log("Listening..."));

function homepage(req, res) {
    res.Ok200(`<html>
        <head><title>Homepage</title></head>
        <body>
            <h1>Home Page</h1>
            <ul>
                <li><a href="/settings">View Settings</a> (Ok200, with object response)</li>
                <li><a href="/systemsettings">View System Settings</a> (NotAuthorized401, with no response)</li>
            </ul>
            <h3>Or change name:</h2>
            <form action="/settings" method="post">
                <label for="name">Name: </label>
                <input type="text" id="name" name="name">
                <input type="submit" value="Submit"> (NotAuthorized401, with text response)
            </form>
        </body>
    </html>`);
}

function getSettings(req, res) {

    const userSettings = {
        name: 'George',
        preference: 'yes'
    }

    res.Ok200(userSettings);
}

