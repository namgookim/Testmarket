import ProductScroll from "@/app/components/list-productScroll";

import { Prisma } from "@prisma/client";
import db from "@/app/lib/db";

export async function getProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getProducts>;

export default async function Products() {
  const initialProducts = await getProducts();
  return (
    <div>
      <ProductScroll initialProduct={initialProducts}></ProductScroll>
    </div>
  );
}
