async function test() {
  const res = await fetch('https://headwp.halonso.digital/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ObtenerDatosInicio {
          nodeByUri(uri: "/") {
            ... on Page {
              configuracionInicio {
                heroSlide1 { image { node { sourceUrl altText } } tag heading subheading buttonText buttonLink }
                heroSlide2 { image { node { sourceUrl altText } } tag heading subheading buttonText buttonLink }
                heroSlide3 { image { node { sourceUrl altText } } tag heading subheading buttonText buttonLink }
                heroText
                heroImage { node { sourceUrl altText } }
                heroProduct
                newProductsTitle
                promoMedia
                promoText
                promoProduct
                quoteText
                quoteAuthor
                featuredCategories
                starProducts
              }
            }
          }
        }
      `
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
