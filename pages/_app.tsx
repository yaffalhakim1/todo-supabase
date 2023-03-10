import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/lib/supabaseClient";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <SessionContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
        <Toaster closeButton richColors />
      </SessionContextProvider>
    </ChakraProvider>
  );
}
