import { number } from "zod";
import getSession from "@/app/lib/session";
import db from "@/app/lib/db";
import { notFound, redirect } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";

import DeleteProductBtn from "./delete-button";
// 로그인한 사용자가 올린 상품 상세 페이지인지 확인
// 자기가 올린 상품이면 구매 버튼 대신 수정이나 글내림 버튼 등이 대신 보여야 하는 경우를 위해 필요한 함수입니다.
async function checkOwner(userId: number) {
  const session = await getSession();

  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const owner = await checkOwner(product.userId);

  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={product.photo} alt={product.title}></Image>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-600">
        <div className="size-10 rounded-full">
          {product.user.avatar !== null ? (
            <Image
              width={40}
              height={40}
              src={product.user.avatar}
              alt={product.user.username}
            ></Image>
          ) : (
            <UserIcon></UserIcon>
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span>{product.price}</span>
        {owner ? (
          <DeleteProductBtn id={product.id}></DeleteProductBtn>
        ) : (
          <Link href={``}>채팅하기</Link>
        )}
      </div>
    </div>
  );
}
