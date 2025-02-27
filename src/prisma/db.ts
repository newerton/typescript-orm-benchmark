import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
prisma.$use(async (params: any, next: any) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  console.log(
    `Query ${params.model}.${params.action} took ${after - before}ms`
  );

  return result;
});
export default prisma;
