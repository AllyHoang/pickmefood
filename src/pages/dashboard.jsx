import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard.module.css";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import Router from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styles
import { HomeLayout } from "@/page-components/layouts";

const Dashboard = ({ parsedCookies }) => {
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    // Get the token from the parsed cookies
    const token = parsedCookies.token || "";
    console.log("Token:", token);
    setToken(token);

    // Decode the token
    try {
      const decoded = jwt.decode(token);
      console.log("Decoded Token:", decoded);
      setDecodedToken(decoded);
    } catch (error) {
      console.error("Error decoding token:", error.message);
    }

    // Redirect to login page if token is not present
    if (!token) {
      setRedirectToLogin(true);
      // Show toast notification
      // Show toast notification
    }
  }, [parsedCookies]);

  // Redirect to login page if redirectToLogin is true
  useEffect(() => {
    if (redirectToLogin) {
      toast.error("You must be logged in to access this page");
      toast.error("You must be logged in to access this page");
      Router.replace("/");
    }
  }, [redirectToLogin]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome to the Dashboard</h1>
      <p>Token Value: {token}</p>
      {decodedToken && (
        <div>
          <h2>Decoded Token:</h2>
          <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
        </div>
      )}
      <ToastContainer />
      <ToastContainer />
    </div>
  );
};

Dashboard.Layout = HomeLayout;

export default Dashboard;

export async function getServerSideProps(context) {
  const parsedCookies = cookie.parse(context.req.headers.cookie || "");

  return { props: { parsedCookies } };
}
