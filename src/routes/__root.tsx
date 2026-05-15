import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-gold">404</h1>
        <p className="mt-4 text-sm tracking-widest-x text-muted">page not found.</p>
        <div className="mt-6">
          <Link to="/" className="text-gold border-b border-gold pb-1 text-xs tracking-widest-x">
            go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl text-ivory">something broke.</h1>
        <p className="mt-2 text-xs tracking-widest-x text-muted">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 text-gold border-b border-gold pb-1 text-xs tracking-widest-x"
        >
          try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "thefajiz" },
      { name: "description", content: "thefajiz." },
      { property: "og:title", content: "thefajiz" },
      { property: "og:description", content: "thefajiz." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "thefajiz" },
      { name: "twitter:description", content: "thefajiz." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const active = router.state.location.pathname === "/resume";
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed top-6 right-6 md:right-12 z-[60] flex items-center h-24">
        <Link to="/resume" className={`stroke-button text-xs tracking-widest-x${active ? " active-btn" : ""}`}>
          resume
          <span className="hover-text" aria-hidden="true">resume</span>
        </Link>
      </div>
      <Outlet />
    </QueryClientProvider>
  );
}
