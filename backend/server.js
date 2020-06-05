const http = require('http');
const app = require('./app');

const normalizePort = val => { // This function will allow us to find a valid port, in number OR string format
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => { // Error handling in case something doesn't work as intended
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // We use our app.js import to specify all our applicationss information

server.on('error', errorHandler); // If there's an error when trying to start our server, we'll be blocked here
server.on('listening', () => { // However if all goes well, then this chunk of code will be executed
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // And give console confirmation that the server launched successfully
});

server.listen(port);
