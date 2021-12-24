const express = require('express');
const bodyParser = require('body-parser');
const morganBody = require("morgan-body");
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

const HOST = "localhost";
const PORT = 3000;
// const API_SERVICE_URL = "https://jsonplaceholder.typicode.com/";
const API_SERVICE_URL = "http://localhost:3001/";

const app = express();

app.use(bodyParser.json());

morganBody(app);

app.post('/hpm', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true
}));

app.post('/axios', async (req, res) => {
    await axios.post(`${API_SERVICE_URL}/axios`, {
       "userId":9999,
       "title":"Buy groceries using Axios",
       "body":"Buy a bunch of food using Axios"
    });

    res.status(200).json({
        "id": 8999,
        "userId": 9999,
        "title":"Buy groceries using Axios",
        "body":"Buy a bunch of food using Axios"
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
