import { BookingI } from "@/interface/api/booking"


const Success = ({booking}:{booking: BookingI | undefined}) => {
    if (!booking) {
        return (
            <span></span>
        )
    }

    return (
        <section
            className='flex flex-col mx-2 border-green-500 border-2 rounded-md p-4 max-w-3xl md:mx-auto mb-4'
        >
            <h1 className="text-xl text-center font-bold">
                Payment Successful!
            </h1>

        </section>
    )
}

export default Success