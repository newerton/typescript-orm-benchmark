import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import drizzle from "./src/drizzle";
import knex from "./src/knex";
import objection from "./src/objection";
// import prisma from "./src/prisma";
import prisma from './src/prisma/db'
import sequelize from "./src/sequelize";

import { initializeTypeOrm } from "./src/typeorm";

const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10;
const DEFAULT_PARAMETER_LIMIT = 10000;
const PORT = 8080;

const app = express();
app.use(express.json());
// Client must send "Content-Type: application/json" header
// app.use(
//   bodyParser.json({
//     limit: DEFAULT_BODY_SIZE_LIMIT,
//   })
// );

// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//     parameterLimit: DEFAULT_PARAMETER_LIMIT,
//   })
// );

// app.use("/knex", knex);
// app.use("/sequelize", sequelize);
// app.use("/objection", objection);
// app.use("/prisma", prisma);
// app.use("/drizzle", drizzle);

app.get("/prisma/orders", async (req, res) => {
  try {
    const orders = await prisma.orders.findMany();
    res.json(orders);
  } catch (error) {
    console.error("Erro ao obter as ordens:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
