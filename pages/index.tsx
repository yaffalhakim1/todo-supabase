import Head from "next/head";
import { Inter } from "@next/font/google";
import { Auth } from "@supabase/auth-ui-react";
import TodoList from "@/components/TodoList";
import { ThemeSupa } from "@supabase/auth-ui-react/dist/esm/common/theming/defaultThemes";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const user = Auth.useUser();

  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <>
      <Head>
        <title>TodoList NextJS</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        {!session ? (
          <Container>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              // providers={["github"]}
            />
          </Container>
        ) : (
          <div
            className="w-full h-full flex flex-col justify-center items-center p-4"
            style={{ minWidth: 250, maxWidth: 600, margin: "auto" }}
          >
            <TodoList session={session} />
            <Button
              mt={4}
              colorScheme="red"
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                if (error) console.log("Error logging out:", error.message);
              }}
            >
              Logout
            </Button>
            <Center>
              {" "}
              <Flex height="200px" align="flex-end">
                <Text fontSize="sm">
                  Created by{" "}
                  <Link isExternal href="https://bento.me/yafialhakim">
                    Muhammad Yafi Alhakim
                  </Link>{" "}
                  using NextJS and Supabase V2
                </Text>
              </Flex>
            </Center>
          </div>
        )}
      </Container>
    </>
  );
}
