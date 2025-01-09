import { BookingI } from "@/interface/api/booking"
import Image from 'next/image'


const Vehicle = (vehicle: BookingI['vehicle']) => {

    return (
        <div className="bg-slate-100 p-2 rounded-lg text-sm md:text-lg col-span-8">
            {/* <h3 className="text-xl md:text-2xl text-blue-600">
                Vehicle Information
            </h3> */}
            <div className="flex gap-2">
                <div>
                    
                    <Image 
                        src={vehicle.profilePicture.url} 
                        alt={`${vehicle.name} profile`}
                        height={240}
                        width={240}
                        className="rounded-lg w-32 md:w-48"
                    />
                </div>
                <div>
                    <p
                        className="font-bold"
                    >
                        {vehicle.name}
                    </p>
                    <p>
                        License Plate: N/A
                    </p>
                    <p>
                        {vehicle.type}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Vehicle