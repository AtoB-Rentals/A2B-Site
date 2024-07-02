import Link  from "next/link"

const Navbar = () => {

    return (
        <div className="w-full py-8 px-20 text-neutral-900">
            <nav className="flex w-full justify-between">
                <header>
                    <h1>A2B Rentals</h1>
                </header>
                <ul className="flex no-underline list-none gap-4">
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