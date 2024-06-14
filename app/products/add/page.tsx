"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema, productType } from "./schema";
import { getUploadUrl, uploadProduct } from "./action";
import Input from "@/app/components/form-input";
import Button from "@/app/components/form-btn";
import { useFormState } from "react-dom";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<productType>({ resolver: zodResolver(productSchema) });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // event 대상 객체의 files 속성 추출
    const {
      target: { files },
    } = event;

    // event 실행 후 files가 존재하지 않으면 함수 종료
    if (!files) {
      return;
    }

    // fiels 속성은 배열 데이터 형태이며 내부에 업로드된 파일들의 데이터를 객체 데이터 형태로 저장합니다.
    // 해당 예제에서는 데이터를 하나만 업로드하였다고 가정하므로 그냥 files[0]를 통해 데이터를 추출합시다.
    const file = files[0];

    const url = URL.createObjectURL(file);
    // 해당 state에 해당 파일의 브라우저 메모리 URL 할당
    setPreview(url);
    const { success, result } = await getUploadUrl();
    // Upload URL 요청 성공 시
    if (success) {
      // 가져온 결과값에서 id,uploadUrl 속성 추출 후 state 값에 저장
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setFile(file);
      setValue("photo", `https://imagedelivery.net/MpijFwuy0t4UZQhqSo-Plw/${id}/avatar`);
    }
  };

  const interceptAction = handleSubmit(async (data: productType) => {
    // 1. 성공적으로 Upload URL을 받아왔다면 이를 활용해 CLoudFlare에 해당 이미지를 업로드합니다.
    if (!file) {
      return;
    }
    /* Cloudflare는 form 형식으로 데이터를 받기 원합니다.
       그러므로 새로운 formData 형식의 객체를 형성한 후 이를 기반으로 파일을 업로드합니다.
       그 후에  */
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, { method: "post", body: cloudflareForm });
    if (response.status !== 200) {
      alert("Error");
      // 통신 실패 오류 로직 작성(그냥 간단하게 사용자에게 인식시키는 선에서 끝내도 상관 없습니다.)
    }
    // 2. Form 내부에 있는 file 형식의 데이터를 String 형식으로 변환한 뒤에 저장합니다.
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);

    return uploadProduct(formData);
  });

  const onValid = async () => {
    await interceptAction();
  };

  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          // preview state 값이 존재한다면 해당 URL에 존재하는 파일을 배경으로
          style={{ backgroundImage: `url(${preview})` }}
          className="text-neutral-300 border-2 border-dashed aspect-square flex items-center justify-center flex-col cursor-pointer bg-center bg-cover"
        >
          {preview ? null : (
            <>
              <PhotoIcon className="w-20"></PhotoIcon>
              <div className="text-neutral-400">
                사진을 추가해주십시요
                {errors.photo?.message}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept="image/*"
        />
        <Input
          {...register("title")}
          required
          placeholder="제목"
          type="text"
          errors={[errors.title?.message ?? ""]}
        ></Input>
        <Input
          {...register("price")}
          required
          placeholder="가격"
          type="number"
          errors={[errors.price?.message ?? ""]}
        ></Input>
        <Input
          {...register("description")}
          placeholder="상품을 설명할 글을 작성해주세요"
          type="text"
          errors={[errors.description?.message ?? ""]}
        ></Input>
        <Button text="상품 업로드하기"></Button>
      </form>
    </div>
  );
}
