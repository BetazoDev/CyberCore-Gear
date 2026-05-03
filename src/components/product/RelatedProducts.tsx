import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCTS } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  onSale?: boolean;
  averageRating?: number;
  reviewCount?: number;
  image?: { sourceUrl: string; altText: string };
  productCategories?: { nodes: { name: string; slug: string }[] };
}

export default async function RelatedProducts({ currentSlug }: { currentSlug: string }) {
  let products: Product[] = [];

  try {
    const { data } = await getClient().query({
      query: GET_PRODUCTS,
      variables: { first: 4 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products = ((data as any)?.products?.nodes ?? []).filter(
      (p: Product) => p.slug !== currentSlug
    ).slice(0, 4);
  } catch (e) {
    console.error("RelatedProducts fetch error:", e);
  }

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.databaseId}
          slug={product.slug}
          name={product.name}
          price={product.price}
          regularPrice={product.regularPrice}
          salePrice={product.salePrice}
          onSale={product.onSale}
          imageUrl={product.image?.sourceUrl}
          imageAlt={product.image?.altText}
          category={product.productCategories?.nodes[0]?.name}
          rating={product.averageRating}
          reviewCount={product.reviewCount}
        />
      ))}
    </div>
  );
}
