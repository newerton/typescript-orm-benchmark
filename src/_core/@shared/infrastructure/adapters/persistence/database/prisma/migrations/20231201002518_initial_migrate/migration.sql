-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "value" REAL NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdersItems" (
    "id" TEXT NOT NULL,
    "order_id" VARCHAR(255),
    "item_id" VARCHAR(255),

    CONSTRAINT "OrdersItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrdersItems" ADD CONSTRAINT "OrdersItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersItems" ADD CONSTRAINT "OrdersItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
