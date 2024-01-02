import { getSession } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import Link from "next/link";

export default function Home(){
  const {isLoading, error, user} = useUser();
  if(isLoading) return <div>Loading...</div>;
  if(error) return <div>{error.message}</div>
  return(
    <>
      <Head>
        <title>Chat PQG - Log In or Sign Up</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-800 text-white text-center">
        <div>
          {!!user && <Link href="/api/auth/logout">
            Logout
          </Link>}
          {!user && (<>
              <Link href="/api/auth/login" className="btn">Login</Link>
              <Link href="/api/auth/signup" className="btn">Sign Up</Link>
            </>)
          }
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async(context) => {
  const session = await getSession(context.req, context.res);
  if(!!session){
    return {
      redirect: {
        destination: "/chat"
      }
    }
  }
  return {
    props: {}
  }
}