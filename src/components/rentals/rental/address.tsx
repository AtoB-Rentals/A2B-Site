"use client"
import { AddressType, validateAddressType } from "@/interface/api/address"
import { useSearchParams } from "next/navigation"

const CarAddressSect = () => {
    const q = useSearchParams()

    let addressType = validateAddressType(q.get("addressType") as AddressType)
    console.log("the Address Type: ", q.get("addressType"))

    return (
        <div className="flex flex-col gap-3">
            <div 
                className="bg-gray-200 rounded-md px-1 py-2"
            >
                <p className="font-bold text-lg">
                    Address {addressType !== "Default" && `(${addressType})`}
                </p>
                <p className="text-lg">
                    {q.get("address")}
                </p>
            </div>
        </div>
    )
}

export default CarAddressSect