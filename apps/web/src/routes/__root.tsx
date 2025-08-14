import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Loader from '@/components/loader';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import '../index.css';

// biome-ignore lint/complexity/noBannedTypes: <just for this file as its not important>
export type RouterAppContext = {};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: 'portfolio',
      },
      {
        name: 'description',
        content: 'portfolio is a web application',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  }),
});

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="flex min-h-screen flex-col">
          {/* Fixed Header */}
          <header className="fixed top-0 right-0 left-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-5">
              <Header />
            </div>
          </header>

          {/* Main Content - Scrollable */}
          <main className="flex-1 pt-16 pb-20">
            <div className="container mx-auto px-5 py-5">
              {isFetching ? <Loader /> : <Outlet />}
            </div>
          </main>

          {/* Fixed Footer */}
          <div className="fixed right-0 bottom-0 left-0 z-50">
            <Footer />
          </div>
        </div>
        <Toaster richColors />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
