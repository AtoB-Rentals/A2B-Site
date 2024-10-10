
import { numToDallor } from "@/constants/formatting/money";
import { CarI } from "@/interface/api/car";
import Image from 'next/image';


const CarCard = ({ c }:{ c: CarI }) => {

    return (
        <div
            className='flex shadow-[0_4px_6px_#0000001A] rounded-md h-32 overflow-hidden border border-gray-600 w-full cursor-pointer transition ease hover:-translate-y-1'
        >
            <div className="relative h-full w-32">
                <Image 
                    src={c.profilePicture.url ? c.profilePicture.url : "/images/sedan.png"}
                    alt={c.name}
                    layout="fill"
                    className=" object-cover"
                />
            </div>
            <div className="p-2 flex flex-col justify-between">
                <p className="text-lg text-blue-600 font-bold">
                    {c.name}
                </p>
                <div className="flex justify-between gap-2 items-center">
                    <p>{c.type}</p>
                    <div className="block size-2 rounded-full bg-slate-950"></div>
                    <p>{c.passengers} Passenger</p>
                    <div className="block size-2 rounded-full bg-slate-950"></div>
                    <p>{c.transmission}</p>
                </div>
                <p className="font-extrabold text-xl text-green-600">
                    ${numToDallor(c.price)}
                </p>
            </div>
        </div>
    )
}

export default CarCard