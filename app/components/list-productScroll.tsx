"use client";

import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

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
  const [lastpage, setLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observe = new IntersectionObserver(
      async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observe.unobserve(trigger.current);
          setLoading(true);
          const newProducts = await getMoreProducts(page);
          if (newProducts.length !== 0) {
            setProducts((prevState) => [...prevState, ...newProducts]);
            setPage((prevPage) => prevPage + 1);
          } else {
            setLastPage(true);
          }
          setLoading(false);
        }
      }
    );
    if (trigger.current) {
      observe.observe(trigger.current);
    }

    return () => {
      observe.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <span
        ref={trigger}
        style={{ marginTop: `${page + 1 * 300}vh` }}
        className=" mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
      >
        리스트 더 가져오기
      </span>
    </div>
  );
}
