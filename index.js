const express = require('express');
const morganBody = require("morgan-body");
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const HOST = "localhost";
const PORT = 3000;
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com/";

const app = express();

app.use(bodyParser.json());

morganBody(app);

app.put('/funtimes', (req, res) => {
    res.send('Funtimes!!!');
});

app.use('/', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true
}));

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
