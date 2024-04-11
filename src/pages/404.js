import Link from 'next/link';

function ErrorPage() {
  return (
    <div className="container">
      <h1 className="title">Not Found!</h1>
      <Link href="/" className="home-link">
        Back
      </Link>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f0f0f0;
          text-align: center;
        }
        .title {
          color: #333;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        a.home-link {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          border: none;
          background-color: #0070f3;
          color: white;
          border-radius: 5px;
          text-decoration: none;
          font-size: 1rem;
        }
        a.home-link:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default ErrorPage;
