import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCTS, GET_CATEGORIES } from "@/lib/queries";
import NewProductsClient from "./NewProductsClient";

export default async function NewProductsSection() {
  let products: unknown[] = [];
  let categories: unknown[] = [];

  try {
    const client = await getClient();
    const [productsRes, catsRes] = await Promise.all([
      client.query({ query: GET_PRODUCTS, variables: { first: 12 } }),
      client.query({ query: GET_CATEGORIES }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products = (productsRes.data as any)?.products?.nodes ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories = (catsRes.data as any)?.productCategories?.nodes ?? [];
  } catch (e) {
    console.error("NewProductsSection fetch error:", e);
  }

  return <NewProductsClient initialProducts={products} categories={categories} />;
}
