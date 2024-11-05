"use client"
import { AddressType, validateAddressType } from "@/interface/api/address"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { GeocodeResultI } from '../../../constants/location/googleRequest';
import { getCarAddress } from "@/constants/requests/cars";

const CarAddressSect = ({carId}: {carId: string}) => {
    const [ address, setAddress ] = useState<GeocodeResultI>()
    const q = useSearchParams()

    let addressType = validateAddressType(q.get("addressType") as AddressType)
    console.log("the Address Type: ", q.get("addressType"))

    const handleGetCarAddress = async () => {
        try {
            const res = await getCarAddress(carId)
            if (res.isErr) {
                alert('Something went wrong. Please try again later')
                throw res
            }

            const a = res.data

            const geoAddress: GeocodeResultI = {
                address: a.formatted,
                placeId: a.placeId,
                city: a.city,
                region: a.state,
                country: a.country,
                zipcode: a.zipcode,
                geolocation: {
                    lat: a.geo.coordinates[1],
                    lng: a.geo.coordinates[0]
                },
                latitude: a.geo.coordinates[1],
                longitude: a.geo.coordinates[0],
                type: a.type || "Default",
                bounds: {
                    northeast: {
                        lat: 0,
                        lng: 0
                    },
                    southwest: {
                        lat: 0,
                        lng: 0
                    }
                }
            }

            setAddress(() => ({...geoAddress}))
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (q.get("addressType") === "Area" || !q.get("placeId")) {
            handleGetCarAddress()
        }

        const address: GeocodeResultI = {
            placeId: q.get("placeId") || "",
            address: q.get("address") || "",
            city: q.get("city") || "",
            region: q.get("region") || "",
            country: q.get("country") || "",
            zipcode: q.get("zipcode") || "",
            type: q.get("addressType") as AddressType || "Default",
            geolocation: {
                lat: 0,
                lng: 0
            },
            latitude: parseFloat(q.get("latitude") || "") || 0,
            longitude: parseFloat(q.get("longitude") || "") || 0,
            bounds: {
                northeast: {
                    lat: 0,
                    lng: 0
                },
                southwest: {
                    lat: 0,
                    lng: 0
                }
            }
        }

        setAddress(() => address)

    // @ts-ignore
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(q.toString())

        if (address) {
            Object.keys(address).forEach(key => {
                //@ts-ignore
                let value = address[key]
                if (typeof value === 'object') {
                    value = JSON.stringify(value)
                } else if (typeof value === 'number') {
                    value = value.toString()
                }

                if (key === "type") {
                    key = "addressType"
                }

                params.set(key, value)
            })

            window.history.replaceState({}, '', `?${params.toString()}`)
        }

    }, [address])

    return (
        <div className="flex flex-col gap-3">
            <div 
                className="bg-gray-200 rounded-md px-1 py-2"
            >
                <p className="font-bold text-lg">
                    Address {address?.type !== "Default" && `(${address?.type})`}
                </p>
                <p className="text-lg">
                    {address?.address}
                </p>
            </div>
        </div>
    )
}

export default CarAddressSect