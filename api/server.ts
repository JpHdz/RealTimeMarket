import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";

import type { Product } from "./src/models/product.model";

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

app.use(express.json());

// Message queue from websocket
wsServer.on("connection", (socket) => {
  console.log("Cliente se ha conectado al socket");

  socket.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    const clients = wsServer.clients;
    for (const client of clients) {
      client.send("Te llego una compra");
    }
    console.log(data);
  });
});

// Endpoints using HTTP
app.use(cors());

server.listen(3000, () => {
  console.log("App running on port 3000");
});

app.get("/health", (req, res) => {
  res.json({ message: "Todo bien" });
});

app.get("/products", (req, res) => {
  const products: Product[] = [
    { id: 1, name: "Laptop Dell", price: 12000 },
    { id: 2, name: "Mouse Logitech", price: 800 },
  ];
  res.json(products);
});
