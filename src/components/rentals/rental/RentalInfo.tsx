import { CarI } from "@/interface/api/car"
import Image from "next/image"
import RentalSchedule from "./Schedule"
import { numToDallor } from '../../../constants/formatting/money';
import CarAddressSect from "./address";
import Options from "./options";
import BookBttn from "./BookBttn";
import { headers } from "next/headers";
import { getIPData, IPDataI } from "@/constants/ip";

interface RentalInfoI {
    car: CarI
}

const RentalInfo = async ({car}: RentalInfoI) => {
    const head = headers()
    const ip = head.get('X-Client-IP')
    let ipD: IPDataI | null = null
    
    if (ip !== null) {
        ipD = await getIPData(ip)
    }
    
    const timezone = ipD?.timezone || ""
    
    return (
        <>
            <div 
                className="rounded-md shadow-[0px_0px_4px_1px] flex flex-col items-center md:items-start py-3 px-2 gap-2 md:grid grid-cols-3 auto-cols-max mb-12"
            >
                <div className="relative w-full min-h-56 md:w-full md:min-h-56 rounded-md flex justify-center md:col-span-1 md:row-span-2">
                    <Image 
                        src={!!car.profilePicture.url ? car.profilePicture.url : "/images/sedan.png"} 
                        alt={car.name}
                        layout="fill"
                        className="object-cover rounded-lg"
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full text-center md:text-left col-span-2 font-bold text-lg">
                    <div className=" p-3 rounded-lg w-full md:w-30 bg-green-500 text-white">
                        <p>${numToDallor(car.price)}/day</p>
                    </div>
                    <div className="bg-slate-200 p-3 rounded-lg w-full md:w-30">
                        <p>Seats {car.passengers}</p>
                    </div>
                    <div className="bg-slate-200 p-3 rounded-lg w-full md:w-30">
                        <p>{car.transmission}</p>
                    </div>
                </div>
                <div className="col-start-2 col-span-2 text-lg">
                    <p className="font-bold ">
                        Description
                    </p>
                    <p>
                        {`${car.name} in ${car.address?.formatted}`}
                    </p>
                </div>
                <div className="col-start-1 col-span-1">
                    <RentalSchedule 
                        carId={car.id}
                    />
                </div>
                <div className="col-start-1 col-span-1">
                    <CarAddressSect carId={car.id}/>
                </div>
                <div className="col-start-2 col-span-2 row-start-3 self-start w-full">
                    <Options addOns={car.addOns}/>
                </div>
                <div className="col-start-2 col-span-2 row-start-4 self-start">
                    <h3 className="font-bold text-xl">
                        Gallery
                    </h3>
                    <div className="flex gap-3 overflow-x-auto h-4 hover:h-60 md:h-auto transition-all">
                        {car.pictures.map(p => (
                            <div 
                                key={p.publicId}
                                className="relative size-52 rounded-md"
                            >
                                <Image 
                                    src={p.url} 
                                    alt={p.type}
                                    layout="fill"
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-start-1 col-span-1 w-full">
                    <BookBttn carId={car.id} timezone={timezone}/>
                </div>
            </div>
        </>
    )
}

export default RentalInfo