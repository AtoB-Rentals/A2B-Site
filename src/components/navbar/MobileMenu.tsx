

const MobileMenu = ({ children }: Readonly<{children: React.ReactNode }>) => {
    return (
        <details className="text-secondary">
            <summary>Menu</summary>
            <ul className="bg-base-100 p-2 z-10 w-36 -translate-x-14">
                {/* ex. <li><a>Link 1</a></li> */}
                { children }
            </ul>
        </details>
    )
}

export default MobileMenu