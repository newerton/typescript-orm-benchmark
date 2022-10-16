import { PrismaClient } from "@prisma/client";
import { Router, Request, Response, NextFunction } from "express";

import prisma from "./db";

const router = Router();

router.get(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    const { simple } = req.query;

    const options = simple ? {} : { include: { items: true } };
    try {
      const orders = await prisma.orders.findMany(options);
      return res.status(200).send({ orders });
    } catch (error) {
      return next("Error processing values");
    }
  }
);

router.post(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    const ordersPayload = req.body[0];
    try {
      const [orders] = await prisma.$transaction([
        prisma.orders.create({
          data: {
            user: ordersPayload.user,
            orders_items: {
              create: [
                {
                  items: {
                    create: {
                      name: ordersPayload.items[0].name,
                      value: ordersPayload.items[0].value,
                    },
                  },
                },
              ],
            },
          },
        }),
      ]);
      return res.status(200).send({ orders });
    } catch (error) {
      console.log(error);
      return next("Error processing values");
    }
  }
);

export default router;
