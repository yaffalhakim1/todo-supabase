import Head from "next/head";
import { Inter } from "@next/font/google";
import { Auth } from "@supabase/auth-ui-react";
import TodoList from "@/components/TodoList";
import { ThemeSupa } from "@supabase/auth-ui-shared";
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
import { Database } from "@/lib/schema";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      console.log("error", error);
    } else {
      console.log("data", data);
    }
  }

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
              providers={["github"]}
              redirectTo="/"
            />
          </Container>
        ) : (
          <div>
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
              <Flex height="200px">
                <Center>
                  {" "}
                  <Text fontSize="sm" align="center">
                    Created by{" "}
                    <Link isExternal href="https://bento.me/yafialhakim">
                      Muhammad Yafi Alhakim
                    </Link>{" "}
                    using NextJS and Supabase V2
                  </Text>
                </Center>
              </Flex>
            </Center>
          </div>
        )}
      </Container>
    </>
  );
}
