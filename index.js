import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import chalk from 'chalk';

const cyan = chalk.cyan;
const yellow = chalk.yellow;
const magenta = chalk.magenta;
const green = chalk.green;
const red = chalk.red;

const HOST = "localhost";
const PORT = 3000;
// const API_SERVICE_URL = "https://jsonplaceholder.typicode.com/";
const API_SERVICE_URL = "http://localhost:3001/";

const app = express();

let logMessage = '';
let start;

const formatJson = jsonString => {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
}

const statusColor = httpStatus => {
    return httpStatus < 400 ? green(httpStatus) : red(httpStatus);
}

app.use(createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,

    onProxyReq: (proxyReq, req, res) => {
        logMessage += `${cyan("Request: ")} ${yellow(req.method)} ${req.url}\n\n`;
        
        logMessage += `${magenta('Request Headers:')}\n${JSON.stringify(req.headers, null, 2)}\n\n`

        let body = '';

        req.on('data', data => {
            data = data.toString('utf-8');
            body += data;
        });

        req.on('end', () => {
            logMessage += `${magenta('Request Body:')}\n${formatJson(body)}\n\n`;
            start = process.hrtime();
        });
    },

    onProxyRes: (proxyRes, req, res) => {
        const end = process.hrtime(start);
        logMessage += `${cyan('Response:')} ${statusColor(res.statusCode)} `;
        logMessage += `${end[0]}s ${end[1] / 1000000}ms\n\n`;
        logMessage += `${magenta('Response Headers:')}\n${JSON.stringify(res.getHeaders(), null, 2)}\n\n`
        
        let body = '';

        proxyRes.on('data', data => {
            data = data.toString('utf-8');
            body += data;
        });

        proxyRes.on('end', () => {
            logMessage += `${magenta('Response Body:')}\n${formatJson(body)}\n\n`;
            logMessage += '=======================================================================';
            console.log(logMessage);
            logMessage = '';
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
