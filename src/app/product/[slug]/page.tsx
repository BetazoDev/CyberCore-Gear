import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCT_BY_SLUG, GET_ALL_PRODUCT_SLUGS } from "@/lib/queries";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const client = await getClient();
    const { data } = await client.query({ query: GET_ALL_PRODUCT_SLUGS });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as any)?.products?.nodes ?? []).map((p: { slug: string }) => ({
      slug: p.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const client = await getClient();
    const { data } = await client.query({
      query: GET_PRODUCT_BY_SLUG,
      variables: { slug },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product = (data as any)?.product;
    if (!product) return { title: "Product Not Found | CyberCore Gear" };
    return {
      title: `${product.name} | CyberCore Gear`,
      description: product.shortDescription?.replace(/<[^>]*>/g, "") || product.name,
      openGraph: {
        images: product.image ? [{ url: product.image.sourceUrl }] : [],
      },
    };
  } catch {
    return { title: "Product | CyberCore Gear" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  let product: Record<string, unknown> | null = null;
  try {
    const client = await getClient();
    const { data } = await client.query({
      query: GET_PRODUCT_BY_SLUG,
      variables: { slug },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product = (data as any)?.product ?? null;
  } catch (e) {
    console.error("ProductPage fetch error:", e);
  }

  if (!product) notFound();

  const images: string[] = [
    ...(product.image ? [(product.image as { sourceUrl: string }).sourceUrl] : []),
    ...((product.galleryImages as { nodes: { sourceUrl: string }[] })?.nodes?.map((n) => n.sourceUrl) ?? []),
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-ccg-border bg-ccg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-ccg-muted">
            <a href="/" className="hover:text-ccg-purple transition-colors cursor-pointer">Home</a>
            <span>/</span>
            <a href="/catalog" className="hover:text-ccg-purple transition-colors cursor-pointer">Catalog</a>
            <span>/</span>
            <span className="text-ccg-muted line-clamp-1">{product.name as string}</span>
          </nav>
        </div>
      </div>

      {/* Main PDP grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery images={images} alt={product.name as string} />
          <ProductInfo product={product} />
        </div>

        {/* Related Products */}
        <div className="mt-20 pt-10 border-t border-ccg-border">
          <h2 className="font-russo text-2xl md:text-3xl text-ccg-black mb-8">
            También te puede <span className="text-ccg-purple">interesar</span>
          </h2>
          <RelatedProducts currentSlug={slug} />
        </div>
      </div>
    </div>
  );
}
