import { numToDallor } from "@/constants/formatting/money";
import { BookingI } from "@/interface/api/booking";


const BookingSection = ({booking}:{booking: BookingI}) => {
    

    return (
        <div
            className="flex flex-col gap-2 mx-2 border-2 border-blue-500 rounded-md p-2 mb-4 max-w-3xl md:mx-auto motion-translate-x-in-[-23%] motion-translate-y-in-[14%] motion-rotate-in-[22deg]"
        >
            {booking.stripe?.items?.length && booking.stripe?.items?.map(item => (
                <div
                    key={item.id}
                    className="flex justify-between w-full items-center"
                >
                    <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="italic">{item.description}</p>
                    </div>
                    <p>${numToDallor(item.amount)}</p>
                </div>
            ))}
            <span className="block h-[2px] w-full bg-blue-500 rounded-full"></span>
            <div
                className="flex justify-between w-full font-bold text-lg"
            >
                <p>Total</p>
                <p className="font-bold text-lg text-green-600">
                    ${numToDallor(booking.totalPrice)}
                </p>
            </div>
        </div>
    );
}

export default BookingSection