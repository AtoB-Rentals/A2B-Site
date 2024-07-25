

const BookingRequestComplete = () => {

    return (
        <main
            className="flex w-full items-center justify-center text-center p-4 flex-col"
        >
            <h2 className="font-bold">Request Complete</h2>
            <p>We will get in touch with you shortly. Please check your email or phone for updates.</p>
            <a
                href="/"
                className="my-4 p-4 max-w-[200px] rounded-lg bg-orange-500 font-bold"
            >
                Back to Home
            </a>
        </main>
    )
}

export default BookingRequestComplete