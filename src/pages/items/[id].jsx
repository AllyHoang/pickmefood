import { useRouter } from "next/router";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <p>Post: {router.query.id}</p>
      <h1>First Post</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
    </>
  );
}
