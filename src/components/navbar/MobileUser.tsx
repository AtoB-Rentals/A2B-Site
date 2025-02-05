'use client'
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

const MobileUser = () => {
    const session = useSession()

    if (['unauthenticated', 'loading'].includes(session.status)) {
        return (
            <Link href="/login">
                Login
            </Link>
        )
    }


    return (
        <details className="text-secondary">
            <summary>{session.data?.user.name?.split(' ')[0]}</summary>
            <ul className="flex flex-col gap-2 bg-base-100 p-2 z-10 w-36 -translate-x-5">
                {/* ex. <li><a>Link 1</a></li> */}
                <li>
                    <button className="btn" onClick={() => signOut()}>
                        logout
                    </button>
                </li>
            </ul>
        </details>
    )
}

export default MobileUser