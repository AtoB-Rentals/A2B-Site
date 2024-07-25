

const BookingRequestError = () => {

    return (
        <main
            className="flex w-full items-center justify-center text-center p-4 flex-col"
        >
            <h2 className="font-bold">Oops something went wrong</h2>
            <p>Please try again later</p>
            <a
                href="/book"
                className="my-4 p-4 max-w-[200px] rounded-lg bg-orange-500 font-bold"
            >
                Request a Car
            </a>
        </main>
    )
}

export default BookingRequestError