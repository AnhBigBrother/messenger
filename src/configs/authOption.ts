import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import User from "@/models/user-model";
import { connectdb } from "@/lib/connectdb";
import Account from "@/models/account-model";

const authOption: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "bruhh@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Invaid credentials!");
        }
        await connectdb();
        const user = await User.findOne({
          email: credentials.email,
        });
        if (!user) {
          throw new Error("User not found!");
        }
        if (!user.password) {
          throw new Error("Email used with OAuth!");
        }
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error("Wrong password!");
        }

        return user._doc;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    // https://next-auth.js.org/configuration/callbacks
    async signIn({ user, account, profile, email, credentials }) {
      if (account && account.type !== "credentials") {
        let dbUser;
        let dbAccount;

        await connectdb();

        const existedAccount = await Account.findOne({
          providerAccountId: account.providerAccountId,
          provider: account.provider,
        });
        dbAccount = existedAccount || new Account(account);

        const existedUser = await User.findOne({ email: user.email });

        if (existedAccount && existedUser) {
          return true;
        }

        dbUser =
          existedUser ||
          new User({
            name: user.name,
            email: user.email,
            image: user.image,
          });

        if (!dbAccount.user) {
          dbAccount.user = dbUser._id;
        }
        if (!dbUser.accounts.some((id: object) => id.toString() === dbAccount!._id.toString())) {
          dbUser.accounts.push(dbAccount._id);
        }
        await dbAccount.save();
        await dbUser.save();
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).By default only URLs on the same URL as the site are allowed, use the redirect callback to customise that behaviour.
      return baseUrl;
    },
    async jwt({ token, user, account, profile, session, trigger }) {
      // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client). The returned value will be encrypted, and it is stored in a cookie.

      // use update function in useSession hook to trigger update jwt, the session parameter can be use here!
      if (trigger === "update") {
        if (session.data.user.name) token.name = session.data.user.name;
        if (session.data.user.image) token.picture = session.data.user.image;
        return token;
      }

      await connectdb();
      const email = token.email;

      const currentUser = await User.findOne({ email });
      token._id = currentUser._id.toString();
      token.name = currentUser.name;
      token.picture = currentUser.image;
      return token;
    },

    // When using JSON Web Tokens the jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback, like for example an access_token or id from a provider.

    async session({ session, token, user }) {
      // The session callback is called whenever a session is checked. By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token (like access_token and user.id from above) via the jwt() callback, you have to explicitly forward it here to make it available to the client.
      session = {
        ...session,
        user: {
          ...session.user,
          _id: token._id,
        },
      };
      return session;
    },
  },
};

export { authOption };
