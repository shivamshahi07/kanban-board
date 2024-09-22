import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });
  // const router = useRouter();
  // useEffect(() => {
  //   const handleRouteChangeStart = (url) => {
  //     console.log(`Route change starting to ${url}`);
  //   }

  //   const handleRouteChangeComplete = (url) => {
  //     console.log(`Route change completed to ${url}`);
  //   }

  //   const handleRouteChangeError = (err, url) => {
  //     console.error(`Error changing route to ${url}:`, err);
  //   }

  //   router.events.on('routeChangeStart', handleRouteChangeStart)
  //   router.events.on('routeChangeComplete', handleRouteChangeComplete)
  //   router.events.on('routeChangeError', handleRouteChangeError)

  //   return () => {
  //     router.events.off('routeChangeStart', handleRouteChangeStart)
  //     router.events.off('routeChangeComplete', handleRouteChangeComplete)
  //     router.events.off('routeChangeError', handleRouteChangeError)
  //   }
  // }, [router.events])
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        <Component {...pageProps} />
      </QueryClientProvider>
    </Provider>
  );
}
