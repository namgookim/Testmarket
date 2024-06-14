"use server";

import getSession from "@/app/lib/session";
import db from "@/app/lib/db";
import { productSchema } from "./schema";

import { z } from "zod";
import { redirect } from "next/navigation";

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect("/products");
    }
  }
}

export async function getUploadUrl() {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNTID}/images/v2/direct_upload`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGEAPITOKEN}`,
      },
    }
  );
  const data = await res.json();
  return data;
}
