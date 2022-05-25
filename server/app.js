const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const {
  v4,
} = require('uuid');

const app = express();
const server = http.Server(app);
const wss = new WebSocket.Server({
  server,
  perMessageDeflate: false,
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 2020;
}

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
class Queue {
  constructor() {
    this.first = null;
    this.size = 0;
  }

  enqueue(results) {
    const node = new Node(results);
    let newNode;

    if (!this.first) {
      this.first = node;
    } else {
      newNode = this.first;
      if (newNode.next) {
        newNode.next = node;
        return;
      }

      while (newNode.next) {
        newNode = newNode.next;
      }

      newNode.next = node;
    }

    this.size += 1;
    return node;
  }

  dequeue() {
    const temp = this.first;
    this.first = this.first.next;
    this.size -= 1;
    return temp;
  }

  deleteItem(id) {
    let node = this.first;
    if (!node) return;
    if (node.data.id == id) {
      this.dequeue();
      return;
    }
    while (node.next) {
      if (node.next.data.data.id == id) { node.next = node.next.next; } else { node = node.next; }
    }
    this.size -= 1;
  }

  getItem(roomID) {
    let node = this.first;

    if (!node || !roomID) return;
    if (node.data.id == roomID) {
      return node;
    }
    while (node) {
      if (node.data.id == roomID) {
        return node;
      }

      node = node.next;
    }
  }

  setRoomId(webss, roomID) {
    let node = this.first;
    if (!node || !roomID) return;

    while (node) {
      if (node.data.id == roomID) {
        webss.clients.forEach((client) => {
          if (node.data.data[client.id]) {
            node.data.userNames.push(client.userName);
            client.roomID = node.data.id;
            client.gameState = 'open';
          }
        });
        return;
      }
      node = node.next;
    }
  }
}

const gameRooms = new Queue();

app.set('port', port);

function closeGame(webss, ws, isCloseState) {
  const node = gameRooms.getItem(ws.roomID);
  webss.clients.forEach((client) => {
    if (client.roomID == ws.roomID) {
      const room = gameRooms.getItem(ws.roomID);
      if (!room) return;
      for (const key in room.data.data) {
        if (client.id == key) {
          delete client.roomID;
          delete client.gameState;
          if (client.id != ws.id && isCloseState) {
            client.send(JSON.stringify({
              event: 'leave',
              clientID: client.id,
              data: node.data,
            }));
          }
        }
      }
    }
  });
  gameRooms.deleteItem(ws.roomID);
}

wss.on('connection', (ws, req) => {
  const id = v4();
  ws.id = id;
  ws.userName = `Player${Math.floor(Math.random() * 10)}`;
  ws.on('message', (data, isbinary) => {
    const msg = JSON.parse(Buffer.from(data).toString('utf-8'));
    const {
      event,
    } = msg;
    let node = gameRooms.getItem(msg.roomId);
    if (event == 'open') {
      let index = 0;
      let results; let
        roomID;
      ws.gameState = 'start';
      wss.clients.forEach((client) => {
        if (!client.roomID && client.gameState === 'start') {
          if (index % 2 == 0) {
            results = {
              id: '',
              gameType: Math.round(Math.random() * 1) ? 'artists' : 'pictures',
              gameIndex: Math.round(Math.random() * 9),
              userNames: [],
              data: {},
              ready: {},
            };
            results.data[client.id] = [];
          } else {
            results.data[client.id] = [];

            results.id = v4();
            gameRooms.enqueue(results);
            gameRooms.setRoomId(wss, results.id);
          }
          index++;
        }
      });

      wss.clients.forEach((client) => {
        node = gameRooms.first;
        if (node) {
          while (node) {
            if (node.data.data[client.id] && client.gameState === 'open') {
              client.gameState = 'play';
              console.log(client.id);
              node.data.userName = client.userName;
              client.send(JSON.stringify({
                event: 'open',
                clientID: client.id,
                data: node.data,
              }));
            }
            node = node.next;
          }
        }
        client.send(JSON.stringify({
          event: 'start',
          data: {
            online: wss.clients.size,
          },
        }));
      });
    } else if (event == 'fill') {
      node = gameRooms.getItem(ws.roomID);

      if (node) {
        if (node.data.data[ws.id]) { node.data.data[ws.id] = msg.results; }
        wss.clients.forEach((client) => {
          if (node.data.id == client.roomID) {
            client.send(JSON.stringify({
              event: 'fill',
              clientID: client.id,
              data: node.data,
            }));
          }
        });
      }
    } else if (event == 'end') {
      let keys;
      node = gameRooms.getItem(ws.roomID);
      if (node) {
        if (node.data.data[ws.id]) { node.data.ready[ws.id] = msg.isReady; }

        keys = Object.keys(node.data.ready);

        if (node.data.ready[keys[0]] == node.data.ready[keys[1]]) {
          wss.clients.forEach((client) => {
            if (node.data.id == client.roomID) {
              client.send(JSON.stringify({
                event: 'end',
                clientID: client.id,
                data: node.data,
              }));
            }
          });
          closeGame(wss, ws);
        } else {
          ws.send(JSON.stringify({
            event: 'unready',
          }));
        }
      }
    } else if (event == 'leave') {
      closeGame(wss, ws, true);
    }
  });
  ws.on('close', (code) => {
    closeGame(wss, ws, true);
  });
});

server.listen(port, () => {
  console.log('Server created on port', port);
});
