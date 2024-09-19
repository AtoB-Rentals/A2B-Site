import { CarI } from "@/interface/api/car"
import Image from 'next/image';
import Link from "next/link";


const ManCarCard = (car: CarI) => {
    const pictures = car.pictures || []

    return (
        <div
            className="flex flex-col overflow-hidden rounded-md shadow-[0px_0px_12px_3px] max-w-64 h-[450px] shadow-neutral-500 justify-between"
        >
            <div className="flex justify-center items-center overflow-hidden justify-self-center">
                <Image 
                    src={car.profilePicture ? car.profilePicture.url : "/images/sedan.png"}
                    width={256}
                    height={256}   
                    alt={car.name}
                    className="min-w-full min-h-full"
                />
            </div>
            <div className="flex justify-between flex-col p-2 justify-self-end">
                <div className="mb-4 justify-self-center">
                    <p className="font-bold text-lg">
                        {car.name}
                    </p>
                    <p>{car.type}</p>
                    <p className="text-lg text-green-600 font-bold">
                        $50/day{/* car.price */}
                    </p>
                </div>
                <div className="justify-self-end">
                    <Link 
                        className="bg-[#3498db] w-full rounded-md flex items-center justify-center font-bold text-white h-10 text-center"
                        href={`/manager/cars/${car.id}`}
                    >
                        Open
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ManCarCard