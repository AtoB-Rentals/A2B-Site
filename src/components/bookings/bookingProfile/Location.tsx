'use client'
import SetAddressModal from "@/components/modals/setAddress"
import { UpdatePickupAddress } from "@/constants/requests/bookings"
import { ReqAddressI } from "@/interface/api/address"
import { BookingI } from "@/interface/api/booking"
import { useRouter } from "next/navigation"
import { useState } from "react"


const Location = ({
    pA,
    dA,
    bId,
    hydration
}:{
    hydration: () => void
    bId: string
    /**Pickup address */
    pA: BookingI['pickupAddress']
    /**Dropoff Address */
    dA: BookingI['dropOffAddress']
}) => {
    const [updateDropoff, setUpdateDropoff] = useState<boolean>(false)
    const router = useRouter()

    const handleAddressSet = (set: boolean) => {
        setUpdateDropoff(set)
        const currentPath = window.location.pathname; // Get current pathname
        const newUrl = `${currentPath}?set_address=y`;

        router.push(newUrl);
    };

    const handleUpdate = async (req: ReqAddressI): Promise<boolean> => {
        const res = await UpdatePickupAddress(bId, req, updateDropoff)

        if (res.isErr) {
            alert(res.message)
            if (res.status === 400) {
                return false
            } else {
                return true
            }
        }

        hydration()

        return true
    }

    return (
        <>
            <div className="text-md md:text-lg md:flex justify-between gap-3 col-start-1 col-end-9">
                <div 
                    className="rounded-md transition p-2 hover:bg-slate-100 ease-linear cursor-pointer"
                    onClick={() => handleAddressSet(false)}
                >
                    <h3 className="text-xl md:text-2xl text-blue-600">
                        Pickup Address
                    </h3>
                    <div className="flex">
                        {pA.formatted}
                    </div>
                </div>
                <div
                    className="rounded-md transition p-2 hover:bg-slate-100 ease-linear cursor-pointer"
                    onClick={() => handleAddressSet(true)}
                >
                    <h3 className="text-xl md:text-2xl text-blue-600">
                        Drop Off Address
                    </h3>
                    <div className="flex">
                        {dA.formatted}
                    </div>
                </div>
            </div>
            <SetAddressModal 
                title={`Update ${updateDropoff ? "Pickup Address" : "Drop-off Address"}`}
                callback={req => handleUpdate(req)}
            />
        </>
    )
}

export default Location