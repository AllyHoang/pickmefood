import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import connectToDB from "@/core/db/mongodb";
import { UserModel } from "@/core/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const nextAuthOptions = (req, res) => {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        if (account.provider === "google" || account.provider === "facebook") {
          const { name, email } = user;
          try {
            await connectToDB();
            let userExists = await UserModel.findOne({ email });

            if (!userExists) {
              const randomPassword = Math.random().toString(36).substring(7);
              const hashedPassword = await bcrypt.hash(randomPassword, 10);

              userExists = await UserModel.create({
                name,
                email,
                password: hashedPassword,
              });
            }

            // Create token data
            const tokenData = {
              id: userExists._id,
              email: userExists.email,
            };

            const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
              expiresIn: "1d",
            });

            // Set token as a cookie
            res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/`);

            return user;
          } catch (error) {
            console.error(error);
            return false;
          }
        }
        return true;
      },
    },
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
