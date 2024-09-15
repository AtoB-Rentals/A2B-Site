'use client'

import FormModal from "@/components/modals/formModal"
import { addCarPic, delCarPics } from "@/constants/requests/cars"
import { CarI, pictureTypes, PictureTypeT } from "@/interface/api/car"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Cookies from "js-cookie"

interface ManCarProfileI {
    car: CarI
    hydration: () => any
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
    car,
    hydration
}: ManCarProfileI) => {
    const [ picType, setPicType ] = useState<PictureTypeT>()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ selImages, setSelImages ] = useState<string[]>([])

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

        setLoading(true)
        const res = await addCarPic(
            car.id,
            selectedFile,
            picType
        )
        setLoading(false)
        if (res.isErr) return false
        hydration()

        return true
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPicType(e.target.value as PictureTypeT);
    }
    const pictures = car.pictures || []

    const handlePicPress = (id: string) => {
        if (selImages.includes(id)) {
            setSelImages(prev => prev.filter(p => p !== id))
            return
        }

        setSelImages(prev => [...prev, id])
    }

    const handleDelPics = async (): Promise<boolean> => {
        setLoading(true)
        const res = await delCarPics(car.id, selImages)

        if (res.isErr) {
            alert('something went wrong please try again later')
            return false
        }

        hydration()
        setSelImages(prev => prev.filter(p => !prev.includes(p)))

        return true
    }

    
    console.log('pictures: ', pictures)

    return (
        <>
            <div
                className="max-w-[1000px] mx-3 lg:mx-auto rounded-md shadow-[0px_0px_4px_1px] shadow-gray-400 overflow-hidden pb-3 mb-56"
            >
                <div className="flex flex-col w-full justify-around items-center bg-blue-500 h-60 text-white">
                    <div className="flex justify-center items-center rounded-full w-40 h-40 overflow-hidden">
                        <Image 
                            src={pictures.length ? car.pictures[0].url : "/images/sedan.png"} 
                            alt={car.name}
                            width={200}
                            height={200}
                            className="rounded-full"
                        />
                    </div>
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
                        <div className="flex items-center justify-between gap-x-3">
                            <div>
                               {selImages.length} / {pictures.length}
                            </div>
                            {!!selImages.length && <button
                                className="bg-red-500 text-white font-bold py-1 px-2 rounded-md"
                                onClick={() => handleDelPics()}
                            >
                                Delete
                            </button>}
                            <Link 
                                className="bg-blue-500 text-white font-bold py-1 px-2 rounded-md"
                                href={`/manager/cars/${car.id}?add_picture=y`}
                            >
                                Add Picture
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 p-3 gap-1 mx-auto md:grid-cols-3 lg:grid-cols-5">
                        {pictures.map((pic, index) => {
                            const selected = selImages.includes(pic.publicId)
                            return (
                                <div
                                    key={pic.publicId}
                                    className={`
                                        flex justify-center items-center overflow-hidden my-auto w-40 h-fit max-h-36 rounded-md cursor-pointer
                                        ${selected && 'border-4 border-blue-600'}
                                    `}
                                    onClick={() => handlePicPress(pic.publicId)}
                                >
                                    <Image
                                        
                                        src={pic.url}
                                        alt={`${car.name} picture number ${index}`}
                                        width={200}
                                        height={150}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <FormModal 
                title={"Add Picture"} 
                onOk={() => handleAddPic()}
                paramKey={"add_picture"}
                loading={loading}
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
