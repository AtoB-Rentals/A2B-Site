
import { numToDallor } from "@/constants/formatting/money";
import { QueryParams } from "@/constants/requests/constants";
import { CarI } from "@/interface/api/car";
import Image from 'next/image';
import Link from "next/link";


interface CarCardI {
    c: CarI,
    qParams?: string
}

const CarCard = ({ c, qParams }: CarCardI) => {
    qParams = qParams || ""

    return (
        <Link
            href={`/rental/${c.id}?${qParams}`}
            className="card md:card-side glass bg-base-100 shadow-xl w-full"
        >
            <figure>
                <div className="relative h-36 md:h-full w-96 md:w-36">
                    <Image 
                        src={c.profilePicture.url ? c.profilePicture.url : "/images/sedan.png"} 
                        alt={c.name}
                        layout="fill"
                        className="object-cover"
                    />
                </div>
            </figure>
            <div className="card-body">
                <h2 className="text-lg text-blue-600 font-bold">
                    {c.name}
                </h2>
                <div className="flex justify-between gap-2 items-center">
                    <p>{c.type}</p>
                    <div className="block size-2 rounded-full bg-slate-950"></div>
                    <p>{c.passengers} Passenger</p>
                    <div className="block size-2 rounded-full bg-slate-950"></div>
                    <p>{c.transmission}</p>
                </div>
                <p className="font-extrabold text-xl text-green-600">
                    ${numToDallor(c.price)}/day
                </p>
            </div>
        </Link>
    )
}

export default CarCard