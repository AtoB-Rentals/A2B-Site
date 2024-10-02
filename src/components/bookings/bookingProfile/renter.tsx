import { BookingI } from "@/interface/api/booking"


const Renter = (renter: BookingI['renter']) => {

    return (
        <div className="bg-slate-100 p-2 rounded-md text-md md:text-lg col-span-4">
            <h3
                className="text-xl md:text-2xl text-blue-600"
            >
                Renter
            </h3>
            <div className="flex justify-between">
                <p
                    className="font-bold"
                >Name:</p>
                <p>{`${renter.firstName} ${renter.lastName}`}</p>
            </div>
            <div className="flex justify-between">
                <p
                    className="font-bold"
                >Email:</p>
                <p>{renter.email}</p>
            </div>
            <div className="flex justify-between">
                <p
                    className="font-bold"
                >Phone Number:</p>
                <a
                    className="text-blue-600 underline"
                    href={`tel:${renter.phoneNumber}`}
                >
                    {renter.phoneNumber}
                </a>
            </div>
        </div>
    )
}

export default Renter