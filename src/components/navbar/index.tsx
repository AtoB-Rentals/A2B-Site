import Link  from "next/link"
import { getServerSession } from "next-auth" 
import { authOptions } from '../../app/api/auth/[...nextauth]/route';
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import Image from "next/image"
import DesktopUser from "./desktopUser";

const Navbar = async () => {
    const session = await getServerSession(authOptions)

    const DesktopNav = "hidden md:flex dark:text-primary hover:bg-secondary hover:text-black"

    return (
        <nav className="navbar bg-base-100">
            <Link href="/" className="flex-1 p-3">
                <Image 
                    src="/images/logo_with_name.png"
                    alt="A2B Rentals"
                    width={150}
                    height={75}
                />
            </Link>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link 
                            href="/rentals"
                            className={`btn btn-ghost btn-sm ${DesktopNav} `}
                        >
                            Rentals
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/coming-soon"
                            className={`btn btn-ghost btn-sm ${DesktopNav} `}
                        >
                            Become A Partner
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/coming-soon"
                            className={`btn btn-ghost btn-sm ${DesktopNav} `}
                        >
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/coming-soon"
                            className={`btn btn-ghost btn-sm ${DesktopNav} `}
                        >
                            Terms Of Condition
                        </Link>
                    </li>
                    <li className="hidden md:flex">
                        <DesktopUser />
                    </li>
                    <li className="md:hidden">
                        <MobileMenu>
                            <li>
                                <Link href="/rentals">
                                    Rentals
                                </Link>
                                <Link href="/coming-soon">
                                    Become A Partner
                                </Link>
                                <Link href="/coming-soon">
                                    Contact US
                                </Link>
                                <Link href="/coming-soon">
                                    Terms and Conditions
                                </Link>
                                <Link href="/login">
                                    Login
                                </Link>
                                <ThemeToggle />
                            </li>
                        </MobileMenu>
                    </li>
                    <li className={`hidden md:flex text-primary`}>
                        <ThemeToggle />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar