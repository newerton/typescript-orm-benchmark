import { Router, Request, Response, NextFunction } from "express";

import prisma from "./db";

const router = Router();

router.get("/orders", async (req: Request, res: Response) => {
  try {
    const { simple } = req.query;
    let orders = [];
    if (simple) {
      orders = await prisma.orders.findMany();
    } else {
      orders = await prisma.orders.findMany({
        include: {
          items: true,
        },
      });
    }

    return res.json(orders);
  } catch (error) {
    console.error("Erro ao obter as ordens:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    const ordersPayload = req.body[0];
    try {
      const orders = await prisma.orders.create({
        data: {
          user: ordersPayload.user,
          items: {
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
      });
      return res.status(200).send({ orders });
    } catch (error) {
      console.log(error);
      return next("Error processing values");
    }
  }
);

export default router;
