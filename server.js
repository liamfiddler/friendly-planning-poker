const http = require('http');
const static = require('node-static');
const api = require('./api');

const INTERNAL_SERVER_PORT = 8080;
const API_PATH = '/api/';
const STATIC_DIR = './static';

const responseType = { 'Content-Type': 'application/json' };
const files = new static.Server(STATIC_DIR);

const apiAndFileServer = async (request, response) => {
  try {
    if (request.url.startsWith(API_PATH)) {
      const action = request.url.replace(API_PATH, '');
      const [status, data] = await api(action, request);
      response.writeHead(status, responseType);
      response.end(JSON.stringify(data));
      return;
    }

    const serveStaticDir = () => files.serve(request, response);
    request.addListener('end', serveStaticDir).resume();
  } catch (error) {
    console.error(error);
    response.writeHead(500, responseType);
    response.end(JSON.stringify({ error }));
  }
};

http.createServer(apiAndFileServer).listen(INTERNAL_SERVER_PORT);
