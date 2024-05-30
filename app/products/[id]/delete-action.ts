"use server";

import db from "@/app/lib/db";

export default async function deleteProductAct(id: number) {
  const deleteItem = await db.product.delete({
    where: {
      id,
    },
  });

  if (!deleteItem) {
    return false;
  } else {
    return true;
  }
}
