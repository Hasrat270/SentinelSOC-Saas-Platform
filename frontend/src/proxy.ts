import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// In Next.js 16, the middleware convention has been moved to proxy.ts
export const proxy = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // If user is logged in and tries to access the landing page, redirect to Dashboard
  if (userId && request.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
