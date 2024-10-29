import { CarI } from "@/interface/api/car"
import Image from "next/image"
import RentalSchedule from "./Schedule"
import { numToDallor } from '../../../constants/formatting/money';


interface RentalInfoI {
    car: CarI
}

const RentalInfo = ({car}: RentalInfoI) => {
    
    return (
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Dicta delectuulla maxime laboriosam itaque consectetur 
                    accusamus corrupti rerum ad! Cupiditate quisquam magni iusto fugit 
                    consequatur laborum dignissimos. Explicabo, tempore.s quam n
                </p>
            </div>
            <div className="col-start-1 col-span-1">
                <RentalSchedule 
                    carId={car.id}
                />
            </div>
            <div className="col-start-2 col-span-2 self-start">
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