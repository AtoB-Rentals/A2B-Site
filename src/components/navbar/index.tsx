import Link  from "next/link"

const Navbar = () => {

    return (
        <div className="w-full py-8 px-14 text-neutral-900">
            <nav className="flex w-full justify-between">
                <header className="z-50">
                    <h1>A2B Rentals</h1>
                </header>
                <input type="checkbox" name="hamburger" id="hamburger" className="peer block lg:hidden"/>
                <ul className="absolute top-0 z-40 h-[100%] bg-white w-48 lg:h-auto lg:w-auto left-[-100%] peer-checked:left-0 lg:translate-x-0 pt-20 lg:pt-0 lg:mt-0 lg:static lg:flex justify-center flex-wrap no-underline list-none gap-4 transition-all ease border-r-2 lg:border-r-0 border-black">
                    <li>
                        <Link
                            href='/'
                        >
                            Cars
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/'
                        >
                            Book
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/'
                        >
                            Become A Partner
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/'
                        >
                            Terms Of Conditions
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/'
                        >
                            Contact Us
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar