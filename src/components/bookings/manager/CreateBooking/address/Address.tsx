import { CarI } from "@/interface/api/car";
import AddressModal from "@/components/modals/AdddressModal";
import Link from "next/link";
import DelAddressPickerModal from "./DelAddressPicker";
import { useEffect, useState } from "react";
import { AddressI, PickDropI } from "@/interface/api/address";
import { useRouter } from "next/navigation";
import SameAsPickUpPop from "./SameAsPickUpPop";
import { set } from "zod";


const Address = ({
    car,
    addresses,
    updateAddresses
}:{
    car?: CarI,
    addresses: PickDropI
    updateAddresses: (addresses: PickDropI) => void
}) => {
    const [isPickup, setIsPickup] = useState(true)
    const [asked, setAsked] = useState(false)
    const router = useRouter()

    const updateDropOff = (address: AddressI | null) => {
        setIsPickup(false)
        updateAddresses({
            ...addresses,
            dropoff: address,
        })
    }

    const handleAddressUpdate = (address: AddressI | null, ask?: boolean) => {
        if (isPickup) {
            updateAddresses({
                ...addresses,
                pickup: address,
            })
        } else {
            updateAddresses({
                ...addresses,
                dropoff: address,
            })
        }

        if (ask) {
            router.push(`/manager/booking/new?car_id=${car?.id || ""}&same_as_pickup=y`)
        }
    }

    useEffect(() => {
        if (addresses.pickup && addresses.dropoff === null) {
            router.push(`/manager/booking/new?car_id=${car?.id || ""}&same_as_pickup=y`)
        } else if (asked && addresses.pickup === null) {
            router.push(`/manager/booking/new?car_id=${car?.id || ""}&same_as_pickup=y`)
        }

        setAsked(false)
    }, [addresses])

    return (
        <>
            <section className="w-full">
                <h1 className="text-2xl text-center font-bold text-blue-600">
                    Pickup and Drop off
                </h1>
                <div className="mx-auto p-4 w-min mt-2 px-8 flex items-center justify-center gap-x-2 rounded-lg overflow-hidden shadow-[inset_0px_0px_10px_4px_#000000]">
                    <button 
                        className={`btn ${isPickup && "btn-secondary"}`}
                        onClick={() => setIsPickup(true)}
                    >
                        Pickup
                    </button>
                    <button 
                        className={`btn ${!isPickup && "btn-secondary"}`}
                        onClick={() => setIsPickup(false)}
                    >
                        Drop off
                    </button>
                </div>
                {/* Display options */}
                <div className="flex w-full gap-1 justify-evenly items-center mt-4 text-2lg flex-wrap">
                    {car && <button 
                        className="btn h-32 border-2 flex-3 border-success mt-4 text-center flex flex-col items-center justify-center"
                        onClick={() => handleAddressUpdate(car.address)}
                    >
                        <p>Vehicle Location</p>
                        <p className="">{car.address.formatted}</p>
                    </button>}
                    <button 
                        className="btn border-primary border-2 rounded mt-4 h-32 w-full flex-1" 
                        onClick={() => router.push(`/manager/booking/new?car_id=${car?.id || ""}&pick_address=y`)}
                    >
                        Choose Delivery Address
                    </button>
                    {/* <Link 
                        className="btn border-primary border-2 rounded mt-4 h-32 w-full flex-1" 
                        href={`/manager/booking/new?car_id=${car?.id || ""}&pick_address=y`}
                    >
                        Choose Delivery Address
                    </Link> */}
                    <Link 
                        className="btn border-white border-2 rounded mt-4 h-32 w-full flex-1" 
                        href={`/manager/booking/new?car_id=${car?.id || ""}&set_address=y`}
                    >
                        Custom Address
                    </Link>
                </div>

                {/* Pickup and drop off address */}
                <div className="md:flex md:justify-around mt-4 gap-4">
                    <div className="flex flex-col gap-2 mt-4">
                        <h1 className="text-xl font-bold text-center">Pickup Address</h1>
                        <p className="text-center">{addresses.pickup?.formatted}</p>
                        {addresses.pickup !== null && <button
                            onClick={() => updateAddresses({
                                ...addresses,
                                pickup: null,
                            })}
                            className="btn btn-primary w-full h-16 text-lg flex items-center justify-center rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                        >
                            Clear
                        </button>}
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        <h1 className="text-xl font-bold text-center">Drop Off Address</h1>
                        <p className="text-center">{addresses.dropoff?.formatted}</p>
                        {addresses.dropoff !== null && <button
                            onClick={() => updateAddresses({
                                ...addresses,
                                dropoff: null,
                            })}
                            className="btn btn-primary w-full h-16 text-lg flex items-center justify-center rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                        >
                            Clear
                        </button>}
                    </div>
                </div>
                
                {addresses.pickup && <SameAsPickUpPop 
                    pickUpAddress={addresses.pickup}
                    updateDropOff={() => updateDropOff(addresses.pickup)}
                />}
                <DelAddressPickerModal 
                    delAddresses={car?.deliveryAddresses || []}
                    updateAddress={(address) => {
                        handleAddressUpdate(address)
                    }}
                />
                <AddressModal 
                    updateAddress={(address) => handleAddressUpdate(address, isPickup)}
                />
            </section>
        </>
    )
}

export default Address