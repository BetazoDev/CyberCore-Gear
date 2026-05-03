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
  let slides: HeroSlide[] = [];

  try {
    const { data } = await getClient().query({ query: GET_HOMEPAGE_DATA });
    const acf = (data as any)?.nodeByUri?.configuracionInicio;
    const themeOptions = (data as any)?.themeOptions;

    // 1. Try Customizer Slides first
    if (themeOptions?.heroSlides && themeOptions.heroSlides.length > 0) {
      slides = themeOptions.heroSlides;
    } 
    // 2. Fallback to ACF Page Slides
    else if (acf) {
      slides = [acf.heroSlide1, acf.heroSlide2, acf.heroSlide3]
        .filter((slide): slide is HeroSlide => !!(slide && (slide.image?.node?.sourceUrl || slide.heading)));
    }
  } catch (e) {
    console.error("HeroSection fetch error:", e);
  }

  // 3. Absolute fallback for design safety
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
