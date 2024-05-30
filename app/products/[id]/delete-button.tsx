"use client";

import deleteProductAct from "./delete-action";
import { useRouter } from "next/navigation";

interface propsType {
  id: number;
}

export default function DeleteProductBtn({ id }: propsType) {
  const router = useRouter();

  async function deleteItem() {
    const checkDelete = await deleteProductAct(id);

    if (!checkDelete) {
      alert("삭제할 수 없습니다");
    } else {
      alert("해당 상품을 삭제하였습니다");
      router.replace("/profile");
    }
  }

  return <button onClick={deleteItem}>상품 제거</button>;
}
