'use client'

import FormModal from "@/components/modals/formModal"
import { addCarPic } from "@/constants/requests/cars"
import { CarI, pictureTypes, PictureTypeT } from "@/interface/api/car"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Cookies from "js-cookie"

interface ManCarProfileI {
    car: CarI
}

const DetailCard = ({
    title,
    children
}:{
    title: string, 
    children: React.ReactNode
}) => {
    return (
        <div className="flex flex-col gap-3 h-32 bg-slate-300 rounded-md p-2">
            <p className="font-bold">{ title }</p>
            {children}
        </div>
    )
}

const CarProfile = ({
    car
}: ManCarProfileI) => {
    const [ picType, setPicType ] = useState<PictureTypeT>()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setSelectedFile(file);
            const filePreview = URL.createObjectURL(file);
            setPreview(filePreview);
        }
    }

    const handleAddPic = async (): Promise<boolean> => {
        if(selectedFile === null) {
            alert('Please provide an image of the vehicle')
            return false
        }
        if(!picType) {
            alert('Please provide the type of picture of the vehicle')
            return false
        }

        const res = await addCarPic(
            car.id,
            selectedFile,
            picType
        )

        if (res.isErr) return false

        return true
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPicType(e.target.value as PictureTypeT);
    };

    return (
        <>
            <div
                className="max-w-[1000px] mx-3 lg:mx-auto rounded-md shadow-[0px_0px_4px_1px] shadow-gray-400 overflow-hidden pb-3 mb-56"
            >
                <div className="flex flex-col w-full justify-around items-center bg-blue-500 h-52 text-white">
                    <Image 
                        src={car.pictures.length ? car.pictures[0].url : "/images/sedan.png"} 
                        alt={car.name}
                        width={200}
                        height={200}
                        className="rounded-full"
                    />
                    <div className="text-center">
                        <h3 className="font-bold">{car.name}</h3>
                        <p>{car.type}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 p-3 gap-2 md:grid-cols-3 lg:grid-cols-4">
                    <DetailCard title="Status">
                        <p className="bg-green-600 text-white font-bold w-fit px-2 rounded-md">
                            Active
                        </p>
                    </DetailCard>
                    <DetailCard title="Price Per Day">
                        <p>
                            $200
                        </p>
                    </DetailCard>
                    <DetailCard title="Passengers">
                        <p>
                            5
                        </p>
                    </DetailCard>
                    <DetailCard title="Transmission">
                        <p>
                            Manual
                        </p>
                    </DetailCard>
                    <DetailCard title="Public Visibility">
                        <p>
                            Visible
                        </p>
                    </DetailCard>
                </div>
                <div className="px-3">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-xl">Gallery</h3>
                        <Link 
                            className="bg-blue-500 text-white font-bold py-1 px-2 rounded-md"
                            href={`/manager/cars/${car.id}?add_picture=y`}
                        >
                            Add Picture
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 p-3 gap-1 mx-auto md:grid-cols-3 lg:grid-cols-5">
                        {car.pictures.map((pic, index) => (
                            <div
                                key={pic.pubicId}
                                className="overflow-hidden"
                            >
                                <Image
                                    
                                    src={pic.url}
                                    alt={`${car.name} picture number ${index}`}
                                    width={200}
                                    height={150}
                                    className="block rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <FormModal 
                title={"Add Picture"} 
                onOk={() => handleAddPic()}
                paramKey={"add_picture"}
            >
                <div className="">
                    <div>
                        <label htmlFor="pictureType" className="block font-bold mb-2">
                            Select Picture Type
                        </label>
                        <select
                            id="pictureType"
                            value={picType}
                            onChange={handleSelectChange}
                            className="border border-gray-300 p-2 rounded-md"
                        >
                            <option value="" disabled>Select a type</option>
                            {pictureTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    {preview && (
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover mb-3 rounded-md" 
                        />
                    )}
                    <input 
                        type="file" 
                        name="image" 
                        id="image" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </FormModal>
        </>
    )
}

export default CarProfile