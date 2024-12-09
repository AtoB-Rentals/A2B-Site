import Link  from "next/link"
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import Image from "next/image"
import DesktopUser from "./DesktopUser";
import MobileUser from "./MobileUser";

const Navbar = async () => {

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
                            href="/manager/cars"
                            className={`btn btn-ghost btn-sm ${DesktopNav} `}
                        >
                            Cars
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/manager/bookings"
                            className={`btn btn-ghost btn-sm ${DesktopNav} `}
                        >
                            Bookings
                        </Link>
                    </li>
                    <li className="hidden md:flex">
                        <DesktopUser />
                    </li>
                    <li className="md:hidden">
                        <MobileMenu>
                            <li>
                                <Link href="/manager/cars">
                                    Cars
                                </Link>
                                <Link href="/manager/bookings">
                                    Bookings
                                </Link>
                                <MobileUser />
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