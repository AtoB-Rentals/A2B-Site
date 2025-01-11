'use client'

import Link from "next/link"
import { useState } from "react"
import MobileUser from "./MobileUser"
import ThemeToggle from "./ThemeToggle"
import Image from "next/image"

const MobileMenu = () => {
    const [show, setShow] = useState<boolean>(false)

    return (
        <>
            {show && <div 
                className="absolute h-full w-full bg-base-100 opacity-25 motion-preset-fade-md left-0 top-0 z-20" 
                onClick={() => setShow(false)}
            >

            </div>
            }
            <li className="md:hidden" onClick={() => setShow(true)}>

                <div className="relative z-30">
                    <div className="flex items-center gap-px">
                        <h3 className="text-secondary">
                            Menu
                        </h3>
                        <Image 
                            src="/images/caret-down-blue.svg"
                            alt="Menu"
                            width={30}
                            height={30}
                            className={`${show ? 'transform rotate-180' : ''} transition-all ease-in-out duration-75`}
                        />
                    </div>
                    {show && <ul 
                        className="bg-base-100 fixed top-28 p-2 min-w-36 -translate-x-20 transition-all ease-in-out duration-75 border-2 border-base-300 rounded-lg"
                        onClick={() => setShow(false)}
                    >
                        <li>
                            <Link href="/rentals" >
                                Rentals
                            </Link>
                            <Link href="/coming-soon" onClick={() => setShow(false)}>
                                Become A Partner
                            </Link>
                            <Link href="/contact-us" onClick={() => setShow(false)}>
                                Contact Us
                            </Link>
                            <Link href="/bookings" onClick={() => setShow(false)}>
                                Bookings
                            </Link>
                            <MobileUser />
                            <ThemeToggle />
                        </li>
                    </ul>}
                </div>
            </li>
        </>
    )
}

export default MobileMenu