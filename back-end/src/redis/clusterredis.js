import { Cluster } from "ioredis";
const pubClient = new Cluster([
  {
    host: "127.0.0.1",
    port: 7000,
  },
  {
    host: "127.0.0.1",
    port: 7001,
  },
  {
    host: "127.0.0.1",
    port: 7002,
  },
]);
const subClient = pubClient.duplicate();

pubClient.on("error", (err) => {
  console.error("Redis PubClient Error:", err);
});

subClient.on("error", (err) => {
  console.error("Redis SubClient Error:", err);
});

export { pubClient, subClient };
