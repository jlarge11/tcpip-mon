#!/usr/bin/env node --experimental-json-modules

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import chalk from 'chalk';
import prettyjson from 'prettyjson';
import { v4 as uuid } from 'uuid';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import packageConfig from './package.json';

const cyan = chalk.cyan;
const yellow = chalk.yellow;
const magenta = chalk.magenta;
const green = chalk.green;
const red = chalk.red;

const TCPIP_MON_ID = 'tcpip-mon-id';

const app = express();

const executions = {};

const formatJson = jsonString => {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
}

const statusColor = httpStatus => {
    return httpStatus < 400 ? green(httpStatus) : red(httpStatus);
}

const argv = yargs(hideBin(process.argv))
    .command('$0 <localPort> <destinationUrl>')
    .example('$0 3000 https://jsonplaceholder.typicode.com')
    .help()
    .version(packageConfig.version)
    .alias('h', 'help')
    .argv;

app.use(createProxyMiddleware({
    target: argv.destinationUrl,
    changeOrigin: true,
    logLevel: 'silent',

    onProxyReq: (proxyReq, req, res) => {
        const tcpipMonId = uuid();
        res.setHeader(TCPIP_MON_ID, tcpipMonId);

        const execution = {
            logMessage: '\n=======================================================================\n'
        };

        executions[tcpipMonId] = execution;

        execution.logMessage += `${new Date()}\n\n`;

        execution.logMessage += `${cyan("Request: ")} ${yellow(req.method)} ${argv.destinationUrl}${req.url}\n\n`;
        
        execution.logMessage += `${magenta('Request Headers:')}\n${prettyjson.render(req.headers)}\n\n`

        let body = '';

        req.on('data', data => {
            data = data.toString('utf-8');
            body += data;
        });

        req.on('end', () => {
            execution.logMessage += `${magenta('Request Body:')}\n${formatJson(body)}\n\n`;
            execution.start = process.hrtime();
        });
    },

    onProxyRes: (proxyRes, req, res) => {
        const tcpipMonId = res.getHeader(TCPIP_MON_ID);
        const execution = executions[tcpipMonId];
        const end = process.hrtime(execution.start);
        execution.logMessage += `${cyan('Response:')} ${statusColor(res.statusCode)} : `;
        execution.logMessage += `${end[0]}s ${end[1] / 1000000}ms\n\n`;
        execution.logMessage += `${magenta('Response Headers:')}\n${prettyjson.render(res.getHeaders())}\n\n`
        
        let body = '';

        proxyRes.on('data', data => {
            data = data.toString('utf-8');
            body += data;
        });

        proxyRes.on('end', () => {
            execution.logMessage += `${magenta('Response Body:')}\n${formatJson(body)}`;
            console.log(execution.logMessage);
            delete executions[TCPIP_MON_ID];
        });
    }
}));

app.listen(argv.localPort, 'localhost', () => {
    console.log(`Starting Proxy to ${argv.destinationUrl} from ${argv.localPort}`);
});
