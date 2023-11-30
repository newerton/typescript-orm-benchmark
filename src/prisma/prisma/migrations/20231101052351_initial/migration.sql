-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user" VARCHAR(255),
    "date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "value" REAL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "item_id" INTEGER,

    CONSTRAINT "orders_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
