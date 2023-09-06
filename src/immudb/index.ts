import type * as ImmudbClient from "@codenotary/immudb-node";
import { randomUUID } from "crypto";
import { Router, Request, Response, NextFunction } from "express";
import { getDbInstance } from "./db";

const router = Router();

router.get(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    // const { simple } = req.query;

    // const options = simple ? {} : { include: { items: true } };

    const db = await getDbInstance();
    try {
      const result = await db.sqlQuery({ sql: `SELECT * FROM customers` });
      const data = result.map((item: any) => prepareData(item));
      db.close();
      return res.status(200).send(data);
    } catch (error) {
      return next("Error processing values");
    }
  }
);

router.post(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    const ordersPayload = req.body[0];

    const db = await getDbInstance();

    try {

      const result = await db.sqlQuery({ sql: `SELECT MAX(id) FROM customers` });
      const row: any = result[0][0];
      const id = row.value.low + 1;

      await db.sqlExec({
        sql: insertCustomer(id, ordersPayload.name),
      });
      await db.close();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      await db.close();
      return next("Error processing values");
    }
  }
);

function insertCustomer(id: number, name: string) {
  return `INSERT INTO customers (
    id,
    active,
    address,
    age,
    city,
    country,
    customer_name,
    email,
    ip
  ) VALUES (
    ${id},
    true,
    'address',
    30,
    'city',
    'country',
    '${name}',
    'email-${randomUUID()}@email.com',
    '127.0.0.1'
  )`;
}

function prepareData(data: ImmudbClient.types.SqlNamedValue[]) {
  const id = data.find((item) => item.name === `(defaultdb.customers.id)`);
  const active = data.find(
    (item) => item.name === `(defaultdb.customers.active)`
  );
  const address = data.find(
    (item) => item.name === `(defaultdb.customers.address)`
  );
  const age = data.find((item) => item.name === `(defaultdb.customers.age)`);
  const city = data.find((item) => item.name === `(defaultdb.customers.city)`);
  const country = data.find(
    (item) => item.name === `(defaultdb.customers.country)`
  );
  const customer_name = data.find(
    (item) => item.name === `(defaultdb.customers.customer_name)`
  );
  const email = data.find(
    (item) => item.name === `(defaultdb.customers.email)`
  );
  const ip = data.find((item) => item.name === `(defaultdb.customers.ip)`);

  const response = {} as any;

  if (id) {
    response["id"] = id.type === "INTEGER" ? id.value.low : null;
  }

  if (active) {
    response["active"] = active.type === "BOOLEAN" ? active.value : null;
  }

  if (address) {
    response["address"] = address.type === "VARCHAR" ? address.value : null;
  }

  if (age) {
    response["age"] = age.type === "INTEGER" ? age.value.low : null;
  }

  if (city) {
    response["city"] = city.type === "VARCHAR" ? city.value : null;
  }

  if (country) {
    response["country"] = country.type === "VARCHAR" ? country.value : null;
  }

  if (customer_name) {
    response["customer_name"] =
      customer_name.type === "VARCHAR" ? customer_name.value : null;
  }

  if (email) {
    response["email"] = email.type === "VARCHAR" ? email.value : null;
  }

  if (ip) {
    response["ip"] = ip.type === "VARCHAR" ? ip.value : null;
  }

  return response;
}

export default router;
