'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const ViewToggler = () => {
    const pathName = usePathname()
    const [endpoint, setEndpoint] = useState<string>("")

    const sliderPosition = endpoint === "bookings" ? "left-0" : "right-0"

    useEffect(() => {
        if (pathName.includes("calendar")) {
            setEndpoint("calendar")
        } else {
            setEndpoint("bookings")
        }
    }, [pathName])

    return (
        <div className="mx-auto w-min mt-2 px-4 h-14 flex items-center justify-center gap-x-2 rounded-lg overflow-hidden shadow-[inset_0px_0px_10px_4px_#000000] relative ">
            <span className={`absolute -z-10 w-1/2 bg-secondary h-full ${sliderPosition} transition duration-300 ease-linear`}>

            </span>

            <Link href="/manager/bookings" 
                className={`btn btn-ghost p-2 py-0 ${endpoint === 'bookings' ? 'text-black' : ''}`}
                onClick={() => setEndpoint("bookings")}
            >
                Bookings
            </Link>
            <Link href="/manager/bookings/calendar" 
                className={`btn btn-ghost p-2 py-0 ${endpoint === 'calendar' ? 'text-black' : ''}`}
                onClick={() => setEndpoint("calendar")}
            >
                Calendar
            </Link>
        </div>
    )
}

export default ViewToggler