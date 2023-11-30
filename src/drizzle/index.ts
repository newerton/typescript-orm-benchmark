import { Router, Request, Response, NextFunction } from "express";

import * as schema from "./schema/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import client from "./db";

const router = Router();
const db = drizzle(client, { schema });

router.get(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { simple } = req.query;

      let orders = [];
      if (simple) {
        orders = await db.query.orders.findMany();
      } else {
        orders = await db.query.orders.findMany({
          with: {
            ordersToItems: {
              with: {
                item: true,
              },
            },
          },
        });
      }
      return res.status(200).send({ orders });
    } catch (error) {
      console.log(error);
      return next("Error processing values");
    }
  }
);

router.post(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    const ordersPayload = req.body[0];
    try {
      const orders = await db
        .insert(schema.orders)
        .values({ date: new Date(), user: ordersPayload.user })
        .returning({ insertedId: schema.orders.id });
      const item = await db
        .insert(schema.items)
        .values({
          name: ordersPayload.items[0].name,
          value: ordersPayload.items[0].value,
        })
        .returning({ insertedId: schema.items.id });
      await db
        .insert(schema.ordersToItems)
        .values({
          order_id: orders[0].insertedId,
          item_id: item[0].insertedId,
        })
        .execute();
      return res.status(200).send({ orders });
    } catch (error) {
      console.log(error);
      return next("Error processing values");
    }
  }
);

export default router;
