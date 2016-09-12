'use strict'

const co = require('co');
const Config = use('Config');
const Session = use('Adonis/Src/Session');
const AuthManager = use('Adonis/Src/AuthManager');

class Socket {
  static init(server) {
    this.connections = {};
    this.io = use('socket.io')(server);
    this.io.on('connection', this.onConnection);
  }

  static onConnection(socket) {
    console.log('connected', socket.id);

    socket.on('disconnect', function(){
      Socket.onDisconnect(socket);
    });

    const connection = Socket.connections[socket.id] = {};
    connection.socket = socket;
    const req = {headers: socket.handshake.headers};
    connection.request = req;
    connection.session = new Session(req, {});
    connection.auth = new AuthManager(Config, connection);
    co(function*() {
      connection.currentUser = yield connection.auth.getUser();
    });
  }

  static onDisconnect(socket) {
    console.log('disconnected', socket.id);
    delete this.connections[socket.id];
  }

  static getSocketsByUser(user) {
    const found = [];
    for(const conn_id in this.connections) {
      const conn = this.connections[conn_id];
      if(conn.currentUser.id == user.id) {
        found.push(conn);
      }
    }
    return found;
  }

  static messageConnections(connectionList, msg) {
    for(const connection of connectionList) {
      connection.socket.emit('message', msg);
    }
  }

  static messageUser(user, msg) {
    return this.messageConnections(this.getSocketsByUser(user), msg);
  }
}

module.exports = Socket;
