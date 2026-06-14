import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-this-in-production",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/", // Redirect to home page for sign in
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    provider: account.provider,
                    id: user.id,
                };
            }
            return token;
        },
        async session({ session, token }) {
            // Pass token data to session
            if (session.user) {
                session.user.id = token.id as string;
                session.user.accessToken = token.accessToken as string;
                session.user.provider = token.provider as string;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            // You can add custom sign-in logic here
            // For example, sync with your backend
            if (account?.provider === "google" || account?.provider === "github") {
                // Optional: Call your backend to create/update user
                // await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/users/social-auth`, {
                //   method: "POST",
                //   headers: { "Content-Type": "application/json" },
                //   body: JSON.stringify({
                //     email: user.email,
                //     name: user.name,
                //     avatar: user.image,
                //     provider: account.provider,
                //   }),
                // });
            }
            return true;
        },
    },
};

export default NextAuth(authOptions);
