import { gql } from "@apollo/client";

// ─── Homepage ─────────────────────────────────────────────────────────────
export const GET_HOMEPAGE_DATA = gql`
  query ObtenerDatosInicio {
    nodeByUri(uri: "/") {
      ... on Page {
        configuracionInicio {
          heroSlide1 { image { node { sourceUrl altText } } tag heading subheading buttonText buttonLink }
          heroSlide2 { image { node { sourceUrl altText } } tag heading subheading buttonText buttonLink }
          heroSlide3 { image { node { sourceUrl altText } } tag heading subheading buttonText buttonLink }
        }
      }
    }
    themeOptions {
      heroSlides {
        image { node { sourceUrl altText } }
        tag
        heading
        subheading
        buttonText
        buttonLink
      }
    }
  }
`;

// ─── Global Settings (Navbar/Footer) ──────────────────────────────────────
export const GET_GLOBAL_SETTINGS = gql`
  query GetGlobalSettings {
    generalSettings {
      title
      description
    }
    siteLogo
    themeOptions {
      promo1
      promo2
      promo3
      heroSlides {
        image { node { sourceUrl altText } }
        tag
        heading
        subheading
        buttonText
        buttonLink
      }
    }
  }
`;

// ─── Products List ────────────────────────────────────────────────────────
export const GET_PRODUCTS = gql`
  query GetProducts($first: Int = 12, $after: String, $category: String) {
    products(
      first: $first
      after: $after
      where: { category: $category, orderby: { field: DATE, order: DESC } }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        ... on SimpleProduct {
          id databaseId slug name price regularPrice salePrice onSale
          averageRating reviewCount
          image { sourceUrl altText }
          productCategories { nodes { name slug } }
        }
        ... on VariableProduct {
          id databaseId slug name price regularPrice salePrice onSale
          averageRating reviewCount
          image { sourceUrl altText }
          productCategories { nodes { name slug } }
        }
      }
    }
  }
`;

// ─── Product Categories ───────────────────────────────────────────────────
export const GET_CATEGORIES = gql`
  query GetCategories {
    productCategories(first: 20, where: { hideEmpty: true, parent: 0 }) {
      nodes { id databaseId name slug count image { sourceUrl altText } }
    }
  }
`;

// ─── Single Product (PDP) ─────────────────────────────────────────────────
export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id databaseId slug name description shortDescription
      averageRating reviewCount
      image { sourceUrl altText }
      galleryImages { nodes { sourceUrl altText } }
      productCategories { nodes { name slug } }
      ... on SimpleProduct {
        price regularPrice salePrice onSale stockStatus
      }
      ... on VariableProduct {
        price regularPrice salePrice onSale stockStatus
        variations {
          nodes {
            id databaseId name price stockStatus
            attributes { nodes { name value } }
          }
        }
        attributes { nodes { name options } }
      }
    }
  }
`;

// ─── All Product Slugs (for generateStaticParams) ─────────────────────────
export const GET_ALL_PRODUCT_SLUGS = gql`
  query GetAllProductSlugs {
    products(first: 200, where: { status: PUBLISH }) {
      nodes { slug }
    }
  }
`;

// ─── Cart Mutation ────────────────────────────────────────────────────────
export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cartItem {
        key quantity product { node { id name } }
      }
    }
  }
`;

// ─── Get Cart ─────────────────────────────────────────────────────────────
export const GET_CART = gql`
  query GetCart {
    cart {
      subtotal total
      contents {
        nodes {
          key quantity total
          product { node { id name image { sourceUrl } } }
        }
      }
    }
  }
`;
