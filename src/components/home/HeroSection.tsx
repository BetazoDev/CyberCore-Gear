import { getClient } from "@/lib/apollo-client";
import { GET_HOMEPAGE_DATA } from "@/lib/queries";
import HeroClient from "./HeroClient";

export interface HeroSlide {
  image?: { node: { sourceUrl: string; altText: string } };
  tag?: string;
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface AcfData {
  heroSlide1?: HeroSlide;
  heroSlide2?: HeroSlide;
  heroSlide3?: HeroSlide;
}

export default async function HeroSection() {
  let acf: AcfData = {};

  try {
    const { data } = await getClient().query({ query: GET_HOMEPAGE_DATA });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acf = (data as any)?.nodeByUri?.configuracionInicio ?? {};
  } catch (e) {
    console.error("HeroSection ACF fetch error:", e);
  }

  // Combine the fixed slides into an array (ignoring empty ones)
  let slides: HeroSlide[] = [acf.heroSlide1, acf.heroSlide2, acf.heroSlide3]
    .filter((slide): slide is HeroSlide => !!(slide && (slide.image?.node?.sourceUrl || slide.heading)));
  
  if (!slides || slides.length === 0) {
    slides = [
      {
        tag: "Highest Quality",
        heading: "Technology simplified,\nelegance amplified.",
        subheading: "Experience innovation, style, and performance in every electronic product.",
        buttonText: "View Shop",
        buttonLink: "/catalog",
      }
    ];
  }

  return <HeroClient slides={slides} />;
}
