import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { jwtDecode } from "jwt-decode";
import { DecodedTokenI } from "@/interface/api";
import { Adapter, AdapterUser } from "next-auth/adapters";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Email & Password',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" },
            },
            // id: "Email & Password",
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                console.log("credntials", credentials)

                const res = await fetch(`${process.env.NEXT_PUBLIC_API!}/api/users/login`, { // Replace '/api/login' with your actual login endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                })

                if (res.status === 401 || res.status === 403) {
                    return null
                }

                if (!res.ok) {
                    return null
                }

                const { data } = await res.json()

                const decodedToken = jwtDecode<DecodedTokenI>(data.token)

                console.log("data", data)

                return {
                    id: data.token as string,
                    email: data.email as string,
                    name: data.name
                }
            }
        })
    ],

    callbacks: {
        async signIn({ account, email, credentials, user }) {
            console.log("sign in", {
                account,
                email,
                user,
                credentials
            })

            if (account?.provider === 'google') {
                //Put the google login here

                return true
            }

            if (!user.email) return false

            return true
        },

        // /**
        //  * JWT Callback: Adds additional user data to the JWT token.
        // */
        async jwt({ token, user, account, profile }) {
            console.log("jwt", {
                token,
                user,
                account,
                profile
            })
            console.log("user 1", user)

            if (user) {
                console.log("user in token", user)
                const decodedToken = jwtDecode<DecodedTokenI>(user.id)
                token.email = user.email
                token.token = user.id
                token.role = decodedToken.role
            }

            return token
        },

        // /**
        //  * Session Callback: Adds user data from the JWT token to the session.
        //  */
        async session({ session, user, token }) {
            console.log("session", {
                session,
                user,
                token
            })

            console.log("token in session", token)

            return session;
        },
    },
    session: {
        strategy: "jwt", // Use JWTs for session handling
    },
    debug: process.env.NODE_ENV === "development",
    cookies: {
        sessionToken: {
            name: "token",
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            },
        },
    },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };