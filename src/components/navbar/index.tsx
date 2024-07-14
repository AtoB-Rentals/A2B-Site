import Link  from "next/link"

const Navbar = () => {

    return (
        <div className="w-full py-8 px-14 text-neutral-900">
            <nav className="flex w-full justify-between">
                <header className="z-50">
                    <a href="/">
                        <h1>A2B Rentals</h1>
                    </a>
                </header>
                <div className="flex items-center justify-end">
                    <input type="checkbox" name="hamburger" id="hamburger" className="peer" hidden={true}/>
                    <label htmlFor="hamburger" className="peer-checked:hamburger block relative z-20  cursor-pointer lg:hidden" accessKey="n">
                        <div aria-hidden="true" className="m-auto h-0.5 w-6 rounded bg-sky-900 transition duration-300"></div>
                        <div aria-hidden="true" className="m-auto mt-2 h-0.5 w-6 rounded bg-sky-900 transition duration-300"></div>
                    </label>


                    <ul className="absolute top-0 z-40 h-[100%] bg-white w-48 lg:h-auto lg:w-auto left-[-100%] peer-checked:left-0 lg:translate-x-0 pt-20 lg:pt-0 lg:mt-0 lg:static lg:flex justify-center flex-wrap no-underline list-none gap-4 transition-all ease border-r-2 lg:border-r-0 border-black">
                        <li>
                            <Link
                                href='/coming-soon'
                            >
                                Cars
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/book'
                            >
                                Book
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/coming-soon'
                            >
                                Become A Partner
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/coming-soon'
                            >
                                Terms Of Conditions
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/coming-soon'
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar