'use client'

import { addDeliveryAddress, delCarPics, NewAddon, RemAddon, RemDeliveryAddress, setProfilePic, upateCarStatus, UpatePassengers, upateTransmission, updateCarAddress, updateCarPrice } from "@/constants/requests/cars"
import { CarI, carStatusList, CarStatusT, transmissions, TransmissionT } from "@/interface/api/car"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import DetailCard from "./DetailCard"
import { numToDallor } from "@/constants/formatting/money"
import { useRouter } from "next/navigation"
import SetAddressModal from "@/components/modals/setAddress"
import { ReqAddressI } from "@/interface/api/address"
import DeliverAddressCard from "./DelAddressCard"
import NewAddonModal from "@/components/modals/cars/NewAddonModal"
import { ReqInvoiceItemI } from "@/interface/api/invoice"
import AddonCard from "./AddonCard"
import ScheduleBlockCarPop from "@/components/modals/ScheduleBlockCar"

interface ManCarProfileI {
    car: CarI
    hydration: () => any
}

const CarProfile = ({
    car,
    hydration
}: ManCarProfileI) => {
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ selImages, setSelImages ] = useState<string[]>([])
    const [ carInfo, setCarInfo ] = useState<CarI>(car)
    const [ exDelAddys, setExDelAddys ] = useState<boolean>(false)
    const [ exAddOns, setExAddOns ] = useState<boolean>(false)
    const router = useRouter()

    const handleSetProPic = async (): Promise<boolean> => {
        if(selImages.length !== 1) {
            alert('Can only set one selected image')
            return false
        }

        setLoading(true)
        const res = await setProfilePic(
            car.id,
            selImages[0],
        )
        setLoading(false)
        if (res.isErr) return false
        hydration()
        setSelImages([])

        return true
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
        setSelImages([])

        return true
    }

    const handleUpdateCarAddreess = async (req: ReqAddressI): Promise<boolean> => {
        const res = await updateCarAddress(car.id, req)

        if (res.isErr) {
            if (res.status === 400) {
                alert(res.message)
            }
        }

        setCarInfo(res.data)

        return true
    }

    const handleAddDelAddress = async (req: ReqAddressI): Promise<boolean> => {
        const res = await addDeliveryAddress(car.id, req)

        if (res.isErr) {
            if (res.status === 400) {
                alert(res.message)
            }
        }

        setCarInfo(res.data)

        return true
    }

    const handleDeleteDelAddress = async (placeId: string) => {
        const res = await RemDeliveryAddress(car.id, placeId)

        if (res.isErr) {
            if (res.status === 400) {
                alert(res.message)
            }
        }

        setCarInfo(res.data)

        return true
    }

    const handleNewAddon = async (req: ReqInvoiceItemI): Promise<boolean> => {
        const res = await NewAddon(car.id, req)

        if (res.isErr) {
            if (res.status === 400) {
                alert(res.message)
            }

            return false
        }

        setCarInfo(res.data)

        return true
    }

    const handleRemoveAddon = async (name: string) => {
        const res = await RemAddon(car.id, name)

        if (res.isErr) {
            if (res.status === 400) {
                alert(res.message)
            }
        }

        setCarInfo(res.data)

        return true
    }

    return (
        <>
            <div
                className="max-w-[1000px] mx-3 lg:mx-auto rounded-md shadow-[0px_0px_4px_1px] shadow-gray-400 overflow-hidden pb-3 mb-56"
            >
                <div className="flex flex-col w-full justify-around items-center bg-blue-500 h-60 text-white">
                    <div className="relative w-32 h-32 overflow-hidden rounded-full">
                        <Image 
                            src={!!car.profilePicture.url ? car.profilePicture.url : "/images/sedan.png"} 
                            alt={car.name}
                            layout="fill"
                            className=" object-cover"
                        />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold">{car.name}</h3>
                        <p>{car.type}</p>
                    </div>
                </div>
                {/* CAR'S DETAILS *some can be editted */}
                <div className="grid grid-cols-1 p-3 gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {car.status === 'available' && <DetailCard
                        title="Create booking"
                        customClick={() => router.push(`/manager/booking/new?car_id=${car.id}`)}
                    >
                        <button
                            className="bg-success text-white font-bold rounded-md p-2"
                        >
                            Create Booking
                        </button>
                    </DetailCard>}
                    <DetailCard 
                        title="Status"
                        inputType="select"
                        options={carStatusList}
                        preValue={car.status}
                        onSave={async value => {
                            const status = value as CarStatusT
                            const res = await upateCarStatus(car.id, status)
                            if (res.isErr) {
                                alert(res.message)
                                return
                            }

                            setCarInfo(prev => ({...prev, status}))
                        }}
                    >
                        <p className={`
                            ${carInfo.status === 'available' && 'bg-green-600'}
                            ${carInfo.status === 'obligations only' && 'bg-black'}
                            ${carInfo.status === 'unavailable' && 'bg-red-600'}
                            text-white font-bold w-fit px-2 rounded-md
                        `}>
                            {carInfo.status}
                        </p>
                    </DetailCard>
                    <DetailCard 
                        title="Price"
                        inputType="number"
                        preValue={car.price.toString()}
                        onSave={async value => {
                            const price = parseInt(value)
                            const res = await updateCarPrice(car.id, price)
                            if (res.isErr) {
                                alert(res.message)
                                return
                            }

                            setCarInfo(prev => ({...prev, price}))
                        }}
                    >
                        <p className="font-bold w-fit rounded-md">
                            ${numToDallor(carInfo.price)}
                        </p>
                    </DetailCard>
                    <DetailCard 
                        title="Transmission"
                        inputType="select"
                        options={transmissions}
                        preValue={carInfo.transmission}
                        onSave={async value => {
                            const transmission = value as TransmissionT
                            const res = await upateTransmission(car.id, transmission)
                            if (res.isErr) {
                                alert(res.message)
                                return
                            }

                            setCarInfo(prev => ({...prev, transmission}))
                        }}
                    >
                        <p className=" font-bold w-fit rounded-md">
                            {carInfo.transmission}
                        </p>
                    </DetailCard>
                    <DetailCard 
                        title="Passengers"
                        inputType="select"
                        options={Array.from({ length: 12 }, (_, i) => (i + 1).toString())}
                        preValue={carInfo.passengers ? carInfo.passengers.toString() : "0"}
                        onSave={async value => {
                            const passengers = parseInt(value) as number
                            const res = await UpatePassengers(car.id, passengers)
                            if (res.isErr) {
                                alert(res.message)
                                return
                            }

                            setCarInfo(prev => ({...prev, passengers}))
                        }}
                    >
                        <p className=" font-bold w-fit rounded-md">
                            {carInfo.passengers}
                        </p>
                    </DetailCard>
                    <DetailCard 
                        title="Publicly Visibility"
                    >
                        <p className=" font-bold w-fit rounded-md">
                            {carInfo.status === 'available' ? 'visible' : 'hidden'}
                        </p>
                    </DetailCard>
                    <DetailCard 
                        title="Address"
                        customClick={() => router.push(`/manager/cars/${car.id}?set_address=y`)}
                        link={carInfo.address ? carInfo.address.url : "#"}
                    >
                        <Link 
                            onClick={(e: any) => e.preventDefault()}
                            href={carInfo.address ? carInfo.address.url : `#`}
                        >
                            {carInfo.address ? carInfo.address.formatted : "N/A" }
                        </Link>
                    </DetailCard>
                    <DetailCard
                        title="Cancel Booking"
                        customClick={() => router.push(`/manager/cars/${car.id}?block_rental=y&car_id=${car.id}`)}
                    >
                        <button
                            className="bg-red-600 text-white font-bold rounded-md p-2"
                        >
                            Block
                        </button>
                    </DetailCard>
                </div>
                {/* ADD-ONS SECTION */}
                <div className="text-lg px-3">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-3 items-center">
                            <h3 className="font-bold text-xl">Add ons</h3>
                            <div className="font-bold">
                                {carInfo.addOns ? carInfo.addOns.length : 0}
                            </div>
                            <button
                                className={`p-2 rounded-md w-24 text-white font-bold ${exAddOns ? "bg-red-600" : "bg-blue-600"}`}
                                onClick={() => setExAddOns(!exAddOns)}
                            >
                                {exAddOns ? "Minimize" : "Expand"}
                            </button>
                        </div>
                        <button
                            className={`p-2 rounded-md text-white font-bold bg-blue-600`}
                            onClick={() => router.push(`/manager/cars/${car.id}?new_addon=y`)}
                        >
                            Add Add-on
                        </button>
                    </div>
                    <div className={`flex flex-col gap-3 overflow-auto transition-all ease-linear cursor-pointer ${exAddOns ? "h-60" : "h-0"}`}>
                        {carInfo.addOns && carInfo.addOns.map(a => (
                            <>
                                <AddonCard 
                                    addOn={a}
                                    remove={handleRemoveAddon}
                                />
                            </>
                        ))}
                    </div>
                </div>
                {/* DELIVERY ADDRESSES SECTION */}
                <div className="text-lg px-3">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-3 items-center">
                            <h3 className="font-bold text-xl">Delivery Addresses</h3>
                            <div className="font-bold">
                                {carInfo.deliveryAddresses ? carInfo.deliveryAddresses.length : 0}
                            </div>
                            <button
                                className={`p-2 rounded-md w-24 text-white font-bold ${exDelAddys ? "bg-red-600" : "bg-blue-600"}`}
                                onClick={() => setExDelAddys(!exDelAddys)}
                            >
                                {exDelAddys ? "Minimize" : "Expand"}
                            </button>
                        </div>
                        <button
                            className={`p-2 rounded-md text-white font-bold bg-blue-600`}
                            onClick={() => router.push(`/manager/cars/${car.id}?set_delivery_address=y`)}
                        >
                            Add Address
                        </button>
                    </div>
                    <div className={`flex flex-col gap-3 overflow-auto transition-all ease-linear cursor-pointer ${exDelAddys ? "h-60" : "h-0"}`}>
                        {carInfo.deliveryAddresses && carInfo.deliveryAddresses.map(a => (
                            <>
                                <DeliverAddressCard
                                    a={a}
                                    key={a.placeId}
                                    remove={placeId => handleDeleteDelAddress(placeId)}
                                />
                            </>
                        ))}
                    </div>
                </div>
                {/* GALLERY SECTION */}
                <div className="px-3">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-xl">Gallery</h3>
                        <div className="font-bold">
                            {selImages.length} / {pictures.length}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-center md:flex items-center gap-x-3">
                        <Link 
                            className="bg-blue-500 text-white text-sm md:text-lg font-bold py-2 px-2 rounded-md"
                            href={`/manager/cars/${car.id}?add_picture=y`}
                        >
                            Add Picture
                        </Link>
                        {selImages.length === 1 && <button
                            className="bg-green-500 text-white text-sm md:text-lg font-bold py-2 px-2 rounded-md"
                            onClick={() => handleSetProPic()}
                        >
                            Profile Picture
                        </button>}
                        {!!selImages.length && <button
                            className="bg-red-500 text-white text-sm md:text-lg font-bold py-2 px-2 rounded-md"
                            onClick={() => handleDelPics()}
                        >
                            Delete
                        </button>}
                    </div>
                    <div className="grid grid-cols-2 p-3 gap-1 mx-auto md:grid-cols-3 lg:grid-cols-5">
                        {pictures.map((pic, index) => {
                            const selected = selImages.includes(pic.publicId)
                            return (
                                <div
                                    key={pic.publicId}
                                    className={`
                                        flex justify-center items-center overflow-hidden my-auto w-40 h-fit max-h-36 rounded-md cursor-pointer ${selected && 'border-4 border-blue-600'}
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
            <SetAddressModal 
                title="Update Address" 
                callback={(req) => handleUpdateCarAddreess(req)}
                searchTypes={['Address']}
                paramKey="set_address"

            />
            <SetAddressModal 
                title="Add Delivery Address" 
                callback={(req) => handleAddDelAddress(req)}
                searchTypes={['Address', 'Airport']}
                paramKey="set_delivery_address"
            />
            <NewAddonModal 
                callback={(req) => handleNewAddon(req)}
            />
            <ScheduleBlockCarPop />
        </>
    )
}

export default CarProfile
