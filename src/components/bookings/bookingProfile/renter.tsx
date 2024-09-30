import { BookingI } from "@/interface/api/booking"


const Renter = (renter: BookingI['renter']) => {

    return (
        <div>
            <h3
                className="font-bold text-2xl text-blue-600"
            >
                Renter
            </h3>
            <div className="flex justify-between text-lg">
                <p
                    className="font-bold"
                >Name:</p>
                <p>{`${renter.firstName} ${renter.lastName}`}</p>
            </div>
            <div className="flex justify-between text-lg">
                <p
                    className="font-bold"
                >Email:</p>
                <p>{renter.email}</p>
            </div>
            <div className="flex justify-between text-lg">
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