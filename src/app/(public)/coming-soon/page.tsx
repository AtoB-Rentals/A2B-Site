

const CommingSoon = () => {

    return (
        <main
            className="flex w-full items-center justify-center text-center p-4 flex-col"
        >
            <h2 className="font-bold">Under Development</h2>
            <p>This page is currently under construction</p>
            <a
                href="/rentals"
                className="my-4 p-4 max-w-[200px] rounded-lg bg-orange-500 font-bold transition ease hover:bg-transparent border-2 border-orange-500"
            >
                Request a Car
            </a>
            <a 
                className="absolute right-0 top-0 w-3 h-3 bg-red-500 cursor-default"
                href="/manager/login"
            >

            </a>
        </main>
    )
}

export default CommingSoon