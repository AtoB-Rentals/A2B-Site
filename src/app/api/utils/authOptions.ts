import NextAuth, { AuthOptions, User } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiURL, objectToQueryString, QueryParams } from '@/constants/requests/constants';

interface AuthUserData {
    id: string,
    name: string,
    email: string,
    role: string
}

const authGetUser = async (
    email: string,
    role: string = 'user'
) => {
    const params = objectToQueryString({
        email,
        role
    }) || ""

    const res = await fetch(`${apiURL}/api/users/auth_user?${params}`)

    return res
}

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            async profile(profile) {
                const res = await authGetUser(profile.email)
                if (res === null) {
                    throw new Error("Unable to authenticate with Google")
                }

                const data = await res.json()
                if (data.code === "USER_NOT_FOUND") {
                    return {
                        id: "USER_NOT_FOUND",
                        name: profile.name,
                        email: profile.email,
                        role: "user"
                    } as AuthUserData as User
                }

                if (!res.ok) {
                    return {
                        id: "SERVER_ERROR",
                        name: profile.name,
                        email: profile.email,
                        role: "user"
                    } as AuthUserData as User
                }


                return data.data as AuthUserData as User
            }
        }),
        CredentialsProvider({
            name: 'Email & Password',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text", placeholder: "user" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                console.log("url", `${process.env.NEXT_PUBLIC_API!}/api/users/login?role=${credentials.role}`)
                console.log("credentials.role:", credentials.role)

                if (!credentials.role) {
                    credentials.role = 'user'
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API!}/api/users/login?role=${credentials.role}`, { // Replace '/api/login' with your actual login endpoint
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
                console.table(data)
                return {
                    id: data.id as string,
                    email: data.email as string,
                    name: data.name as string,
                    role: data.role
                }
            }
        })
    ],

    callbacks: {
        async signIn({ account, user, profile, }) {

            if (account?.provider === 'google') {
                if (user.id === 'USER_NOT_FOUND') {
                    let [firstName, lastName] = user.name?.split(' ') || ['', '']

                    const params = objectToQueryString({
                        firstName,
                        lastName,
                        email: profile?.email || ""
                    })

                    return `/signup?${params}`
                }

                if (user.id === 'SERVER_ERROR') {
                    return false
                }

                return true
            }

            if (!user.email) return false

            return true
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return baseUrl;
        },

        // /**
        //  * JWT Callback: Adds additional user data to the JWT token.
        // */
        async jwt({ token, user, account, profile }) {

            if (user) {
                console.log("user.role jwt: ", user.role)
                token.email = user.email
                token.role = user.role || "user"
                token.name = user.name
                token.id = user.id
            }

            return token
        },

        // /**
        //  * Session Callback: Adds user data from the JWT token to the session.
        //  */
        async session({ session, user, token }) {

            if (token) {
                session.user = {
                    ...session.user,
                    name: token.name ?? "",
                    email: token.email ?? ""
                }
            }

            return session;
        },
    },
    pages: {
        error: "/signup", // Custom error page to handle errors
    },
    // session: {
    //     strategy: "database", // Use JWTs for session handling
    // },
    debug: process.env.NODE_ENV === "development",
    cookies: {
        sessionToken: {
            name: "next-auth-token",
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" || true,
                sameSite: process.env.NODE_ENV === "production" ? "None" : "None",
                path: "/",
                domain: process.env.NODE_ENV === "production" ? ".atob.rentals" : undefined
            },
        },
    },
};

export const handler = NextAuth(authOptions)