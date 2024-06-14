import ProductScroll from "@/app/components/list-productScroll";

import { Prisma } from "@prisma/client";
import Link from "next/link";
import db from "@/app/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";

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
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon></PlusIcon>
      </Link>
    </div>
  );
}
