import { CarI } from "@/interface/api/car"
import Image from "next/image"
import RentalSchedule from "./Schedule"


interface RentalInfoI {
    car: CarI
}

const RentalInfo = ({car}: RentalInfoI) => {

    return (
        <div 
            className="rounded-md shadow-[0px_0px_4px_1px] flex flex-col items-center py-3 px-2 gap-2 md:grid grid-cols-3 mb-12"
        >
            <div className="relative w-full min-h-56 md:w-full md:min-h-56 rounded-md flex justify-center md:col-span-1 md:row-span-2">
                <Image 
                    src={!!car.profilePicture.url ? car.profilePicture.url : "/images/sedan.png"} 
                    alt={car.name}
                    layout="fill"
                    className="object-cover rounded-lg"
                />
            </div>
            <div className="self-start flex gap-10 justify-center md:justify-start flex-wrap md:col-span-2">
                <div className="bg-slate-200 p-3 rounded-lg w-40">
                    <p>Seats {car.passengers}</p>
                </div>
                <div className="bg-slate-200 p-3 rounded-lg w-40">
                    <p>{car.transmission}</p>
                </div>
            </div>
            <div className="col-start-2 col-span-2 text-lg">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Dicta delectus quam nulla maxime laboriosam itaque consectetur 
                    accusamus corrupti rerum ad! Cupiditate quisquam magni iusto fugit 
                    consequatur laborum dignissimos. Explicabo, tempore.
                </p>
            </div>
            <div className="col-start-1 col-span-1">
                <RentalSchedule 
                    carId={car.id}
                />
            </div>
            <div className="col-start-1 col-span-1">
                <button
                    className="bg-blue-600 font-bold text-white text-xl p-3 rounded-md w-full"
                >
                    Book
                </button>
            </div>
        </div>
    )
}

export default RentalInfo