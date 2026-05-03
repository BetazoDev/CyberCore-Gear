import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const changeset = searchParams.get('customize_changeset_uuid');
  
  // Clonar las cabeceras para añadir la información del changeset
  const requestHeaders = new Headers(request.headers);
  
  if (changeset) {
    requestHeaders.set('x-customize-changeset', changeset);
    // Forzamos que se detecte como preview incluso si el referer falla
    requestHeaders.set('x-is-preview', 'true');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Solo aplicar el middleware a las rutas que podrían ser previsualizadas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
