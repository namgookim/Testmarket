import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "올바른 파일을 업로드 해주세요",
  }),
  title: z
    .string({
      required_error: "제목을 입력해주세요",
    })
    .max(50, "입력 한도를 초과했습니다"),
  description: z
    .string({
      required_error: "상품 설명을 기재해주세요",
    })
    .min(10, "10글자 이상 입력해주세요"),
  price: z.coerce.number({
    required_error: "가격을 입력해주세요",
  }),
});

export type productType = z.infer<typeof productSchema>;
