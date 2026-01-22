import { env } from "@acontia/env/server";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

export const products = [
  {
    productId: "product-id",
    slug: "free"
  },
  {
    productId: "your-product-id",
    slug: "pro",
  }
]