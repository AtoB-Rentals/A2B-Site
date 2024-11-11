"use client"
import { CarI } from "@/interface/api/car"
import Image from "next/image"
import { useState } from "react"

const RentalInfoGallery = ({ car }: { car: CarI }) => {
    const [ toggleExpand, setToggleExpand ] = useState<boolean>(false)

    return (
        <>
            <div 
                className="flex gap-2 items-center"
                onClick={() => setToggleExpand(!toggleExpand)}
            >
                <h3 className="font-bold text-2xl">
                    Gallery 
                </h3>
                <div className={`flex ${toggleExpand && "rotate-180"} transition-all ease-out`}>
                    <span
                        className="block h-1 w-4 rounded-full bg-blue-600 rotate-45"
                    ></span>
                    <span
                        className="block h-1 w-4 rounded-full bg-blue-600 -rotate-45 -translate-x-[6px]"
                    ></span>
                </div>
            </div>
            <div className={`flex gap-3 overflow-x-auto h-0 !md:h-auto transition-all ${toggleExpand && "h-60"}`}>
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
        </>
    )
}

export default RentalInfoGallery