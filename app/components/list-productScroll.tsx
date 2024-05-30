"use client";

import { useState } from "react";

import ListProduct from "./list-product";
import { InitialProducts } from "../(tab)/products/page";
import { getMoreProducts } from "../(tab)/products/action";

interface ProductListProps {
  initialProduct: InitialProducts;
}

export default function ProductScroll({ initialProduct }: ProductListProps) {
  const [products, setProducts] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const moreClieck = async () => {
    setLoading(true);
    // skip 옵션이 적용된 데이터, 즉 초기 데이터 외의 추가 데이터를 가져옵니다.
    const addProducts = await getMoreProducts(page);
    // 가져온 추가 데이터를 기존 상품 리스트에 추가
    setProducts((prevState) => [...prevState, ...addProducts]);
    //페이지 수 증가
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <button onClick={moreClieck}>리스트 더 가져오기</button>
    </div>
  );
}
