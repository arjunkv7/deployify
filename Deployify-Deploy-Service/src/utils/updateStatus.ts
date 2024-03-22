import { Client } from "pg";
let DATABASE_URL = process.env.DATABASE_URL;

export default function updateStatus(uniqueId: string) {
  let client = new Client(DATABASE_URL);
  const updateQuery = {
    text: `UPDATE "websiteKey" SET status = $1 WHERE "uniqueId" = $2`,
    values: ["deployed", uniqueId],
  };
  client
    .connect()
    .then(() => {
      console.log("Connected to PostgreSQL database");

      client.query(updateQuery).then((e) => {
        console.log("Status updated for ", uniqueId);
      });
    })
    .catch((err) => {
      console.error("Error connecting to PostgreSQL database", err);
    });
}
