import { Router, Request, Response, NextFunction } from "express";

import { AppDataSource, initRepositories } from "./db";
import { Order } from "./entities/Order";

const router = Router();

export async function initializeTypeOrm(): Promise<Router> {
  const { OrderRepository } = await initRepositories();

  router.get(
    "/orders",
    async (req: Request, res: Response, next: NextFunction) => {
      const { simple } = req.query;

      const options = simple ? {} : { relations: ["items"] };
      try {
        const orders = await OrderRepository.find(options);
        return res.status(200).send({ orders });
      } catch (error) {
        return next("Error processing values");
      }
    }
  );

  router.post(
    "/orders",
    async (req: Request, res: Response, next: NextFunction) => {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const orders = await queryRunner.manager.create(Order, req.body);
        await queryRunner.manager.save(Order, orders);
        await queryRunner.commitTransaction();
        return res.status(200).send({ orders });
      } catch (err) {
        await queryRunner.rollbackTransaction();
        return next("Error processing values");
      } finally {
        await queryRunner.release();
      }
    }
  );

  return router;
}
