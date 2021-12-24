const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');

const HOST = "localhost";
const PORT = 3000;
// const API_SERVICE_URL = "https://jsonplaceholder.typicode.com/";
const API_SERVICE_URL = "http://localhost:3001/";

const app = express();

app.post('/proxy', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,

    onProxyReq: (proxyReq, req, res) => {
        let body = '';

        req.on('data', data => {
            data = data.toString('utf-8');
            body += data;
        });

        req.on('end', () => {
            console.log(`Request Body:\n${body}`);
        });
    },

    onProxyRes: (proxyRes, req, res) => {
        let body = '';

        proxyRes.on('data', data => {
            data = data.toString('utf-8');
            body += data;
        });

        proxyRes.on('end', () => {
            console.log(`Response Body:\n${body}`);
        });
    }
}));

app.post('/axios', async (req, res) => {
    await axios.post(`${API_SERVICE_URL}/axios`, {
       "userId":9999,
       "title":"Buy groceries using Axios",
       "body":"Buy a bunch of food using Axios"
    });

    res.status(201).json({
        "id": 8999,
        "userId": 9999,
        "title":"Buy groceries using Axios",
        "body":"Buy a bunch of food using Axios"
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
