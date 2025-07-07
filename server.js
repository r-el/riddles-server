/**
 * Riddles Server - Main entry point
 * Starts the HTTP server and routes requests
 */
import http from "http";
import { parseRequest } from "./src/middleware/requestParser.js";
import { riddlesRoutes } from "./src/routes/riddlesRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { serverConfig } from "./src/config/database.js";

const { port, host } = serverConfig;

const server = http.createServer((req, res) => {
  parseRequest(req, res, () => {
    try {
      if (req.parsedUrl.pathname === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Welcome to Riddles Server!",
            endpoints: [
              "GET /riddles",
              "POST /riddles/addRiddle",
              "PUT /riddles/updateRiddle",
              "DELETE /riddles/deleteRiddle",
            ],
          })
        );
        return;
      }
      riddlesRoutes(req, res);
    } catch (err) {
      errorHandler(err, req, res);
    }
  });
});

server.listen(port, host, () => {
  console.log(`Riddles Server running at http://${host}:${port}`);
});
