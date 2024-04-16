import Head from "next/head";

function editRequestLayout({children}) {
    return (
        <>
          <Head>
            <title>PickMeFood | Edit Donation</title>
          </Head>
          <main>
            <div>{children}</div>
          </main>
        </>
      );
}

export default editRequestLayout
