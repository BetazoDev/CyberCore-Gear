import { ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";
import { HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

import { headers } from "next/headers";

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

export const { getClient, query, PreloadQuery } = registerApolloClient(async () => {
  let revalidate = 15; // Reducimos el default a 15 segundos
  let isPreview = false;
  let changesetUuid = "";

  try {
    const headersList = await headers();
    const referer = headersList.get("referer") || "";
    const cookie = headersList.get("cookie") || "";
    const mwChangeset = headersList.get("x-customize-changeset");
    const mwIsPreview = headersList.get("x-is-preview");

    // Detectar modo preview (Middleware, Customizer o logueado en WP)
    if (mwIsPreview === 'true' ||
      referer.includes("wp-admin/customize.php") ||
      referer.includes("wp_customize=on") ||
      cookie.includes("wordpress_logged_in")) {
      revalidate = 0;
      isPreview = true;

      // Prioridad al changeset detectado por el middleware
      if (mwChangeset) {
        changesetUuid = mwChangeset;
      } else {
        // Fallback al referer
        const match = referer.match(/customize_changeset_uuid=([a-z0-9-]+)/i);
        if (match) changesetUuid = match[1];
      }

      console.log("🛠️ Modo Preview detectado. Changeset:", changesetUuid || "N/A");
    }
  } catch (e) {
    // Error silencioso en build-time
  }

  // Construir la URL con cache-buster y changeset si es preview
  let uri = WP_API_URL;
  if (isPreview) {
    const urlObj = new URL(WP_API_URL);
    urlObj.searchParams.set("cb", Date.now().toString());
    if (changesetUuid) urlObj.searchParams.set("customize_changeset_uuid", changesetUuid);
    uri = urlObj.toString();
  }

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri,
      headers: {
        ...(isPreview ? {
          "X-CyberCore-Preview": "true",
          "X-Customize-Changeset": changesetUuid,
        } : {}),
        // Forward cookies for auth
        Cookie: (await headers()).get("cookie") || "",
      },
      fetchOptions: {
        next: { revalidate },
        cache: isPreview ? 'no-store' : 'force-cache'
      },
    }),
  });
});
