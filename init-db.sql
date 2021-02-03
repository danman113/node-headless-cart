BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "seller" (
	"seller_id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT,
	"details"	NUMERIC,
	PRIMARY KEY("seller_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "order" (
	"order_id"	INTEGER NOT NULL UNIQUE,
	"payment_type"	TEXT NOT NULL,
	"payment_information"	TEXT NOT NULL,
	"shipping_information"	TEXT NOT NULL,
	"status"	TEXT NOT NULL,
	"completed_at"	TEXT NOT NULL DEFAULT current_timestamp,
	"created_at"	TEXT NOT NULL DEFAULT current_timestamp,
	"updated_at"	TEXT NOT NULL DEFAULT current_timestamp,
	PRIMARY KEY("order_id")
);
CREATE TABLE IF NOT EXISTS "order_item" (
	"order_item_id"	INTEGER NOT NULL UNIQUE,
	"order_id"	INTEGER NOT NULL,
	"item_id"	INTEGER NOT NULL,
	"quantity"	INTEGER NOT NULL,
	PRIMARY KEY("order_item_id" AUTOINCREMENT),
	FOREIGN KEY("order_id") REFERENCES "order"("order_id") ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY("item_id") REFERENCES "item"("item_id") ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "item" (
	"item_id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"price"	INTEGER NOT NULL DEFAULT 0,
	"description"	TEXT,
	"weight"	NUMERIC,
	"stock"	NUMERIC NOT NULL,
	"sku"	TEXT,
	"metadata"	TEXT,
	"created_at"	TEXT NOT NULL DEFAULT current_timestamp,
	"updated_at"	TEXT NOT NULL DEFAULT current_timestamp,
	"requires_shipping"	INTEGER NOT NULL DEFAULT 1,
	"seller_id"	INTEGER NOT NULL,
	PRIMARY KEY("item_id" AUTOINCREMENT),
	FOREIGN KEY("seller_id") REFERENCES "seller"("seller_id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "cart" (
	"cart_id"	TEXT NOT NULL UNIQUE,
	"expires"	TEXT,
	"checked_out"	INTEGER NOT NULL DEFAULT 0,
	"created_at"	TEXT NOT NULL DEFAULT current_timestamp,
	"updated_at"	TEXT NOT NULL DEFAULT current_timestamp,
	"seller_id"	INTEGER NOT NULL,
	PRIMARY KEY("cart_id")
);
CREATE TABLE IF NOT EXISTS "cart_item" (
	"cart_item_id"	INTEGER NOT NULL UNIQUE,
	"cart_id"	INTEGER NOT NULL,
	"item_id"	INTEGER NOT NULL,
	"quantity"	INTEGER NOT NULL,
	PRIMARY KEY("cart_item_id" AUTOINCREMENT),
	FOREIGN KEY("item_id") REFERENCES "item"("item_id") ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY("cart_id") REFERENCES "cart"("cart_id") ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TRIGGER DELETE_ZERO_QUANTITY_CART_ITEMS
   AFTER INSERT ON cart_item
   WHEN NEW.quantity = 0
BEGIN
 DELETE FROM cart_item WHERE cart_item.cart_item_id = NEW.cart_item_id;
END;
COMMIT;
