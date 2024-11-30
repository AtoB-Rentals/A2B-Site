'use client'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react";

const DesktopUser = () => {
    const session = useSession()
    /**this is the same as te main nav */
    const DesktopNav = "hidden md:flex dark:text-primary hover:bg-secondary hover:text-black"

    if (['unauthenticated', 'loading'].includes(session.status)) {
        return (
            <Link 
                href="/login"
                className={`btn btn-ghost btn-sm ${DesktopNav}`}
            >
                Login
            </Link>
        )
    }

    return (
        <details className="text-secondary">
            <summary>{session.data?.user.name}</summary>
            <ul className="bg-base-100 p-2 z-10 w-36">
                <li>
                    <button className="btn" onClick={() => signOut()}>
                        logout
                    </button>
                </li>
            </ul>
        </details>
    )
}

export default DesktopUser