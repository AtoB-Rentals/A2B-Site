"use client"
import { CarI } from "@/interface/api/car"
import Image from "next/image"
import { useState } from "react"

const RentalInfoGallery = ({ car }: { car: CarI }) => {
    const [ toggleExpand, setToggleExpand ] = useState<boolean>(false)
    const [ carPicIndex, setCarPicIndex ] = useState<number>(0)

    const next = () => {
        let nextIndex = carPicIndex + 1 

        if (nextIndex === car.pictures.length) {
            nextIndex = 0
        }

        setCarPicIndex(nextIndex)
    }

    const prev = () => {
        let prevIndex = carPicIndex - 1

        if (prevIndex < 0) {
            prevIndex = car.pictures.length -1
        }

        setCarPicIndex(prevIndex)
    }

    return (
        <div className="w-full">
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
            {/* <div className={`flex gap-3 overflow-hidden w-full h-0 !md:h-auto transition-all ${toggleExpand && "h-60"}`}>
                {car.pictures.map(p => (
                    <div 
                        key={p.publicId}
                        className="relative size-52 shrink-0"
                    >
                        <Image 
                            src={p.url} 
                            alt={p.type}
                            layout="fill"
                            className="object-cover rounded-lg"
                        />
                    </div>
                ))}
            </div> */}
            <div className={`flex justify-between h-0 w-full !md:h-auto transition-all ${toggleExpand && "h-60"}`}>
                {toggleExpand && <button
                    className="w-full h-full flex flex-col justify-center items-center"
                    onClick={() => prev()}
                >
                    <span className="block rounded-full h-1 w-4 -rotate-45 bg-blue-500"></span>
                    <span className="block rounded-full h-1 w-4 rotate-45 bg-blue-500 translate-y-1"></span>
                </button>}
                {/* <div> */}
                    <div 
                        key={car.pictures[carPicIndex]?.publicId}
                        className={`relative ${toggleExpand && "size-60"} shrink-0`}
                    >
                        <Image 
                            src={car.pictures[carPicIndex]?.url ? car.pictures[carPicIndex].url : "/images/sedan.png"} 
                            alt={car.pictures[carPicIndex]?.type}
                            layout="fill"
                            className="object-cover rounded-lg"
                        />
                    </div>
                {/* </div> */}
                { toggleExpand && <button
                    className="w-full h-full flex flex-col justify-center items-center"
                    onClick={() => next()}
                >
                    <span className="block rounded-full h-1 w-4 rotate-45 bg-blue-500"></span>
                    <span className="block rounded-full h-1 w-4 -rotate-45 bg-blue-500 translate-y-[3.75px]"></span>
                </button>}
            </div>
        </div>
    )
}

export default RentalInfoGallery