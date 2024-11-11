"use client"
import { Suspense, useState } from 'react'
import RentalNewUser from './NewUser'
import { DateTime } from 'luxon'
import { useRouter, useSearchParams } from 'next/navigation'
import { GetUserProfile } from '@/constants/requests/users'
import { ReqBookingI } from '@/interface/api/booking'
import { AddressType, validateAddressType } from '@/interface/api/address'
import { createBooking } from '@/constants/requests/bookings'
import RentalLoginUser from './RentalLoginUser'

const GetUserMain = ({timezone, carId}:{
    timezone: string
    carId: string
}) => {
    const router = useRouter()
    const [isNewUser, setIsNewUser] = useState<boolean>(true)
    const [ loading, setLoading ] = useState<boolean>(false)
    const q = useSearchParams()
    const activeChoice1 = "bg-blue-500 text-white"

    timezone = timezone === "" ? timezone : Intl.DateTimeFormat().resolvedOptions().timeZone

    const handleBooking = async () => {
        try {
            setLoading(true)
            const resUser = await GetUserProfile()
            if (resUser.isErr) {
                alert("Unable to find user. Please try again later")
                return
            }
    
            const user = resUser.data
            const start_time = DateTime.fromISO(q.get("start_time") || "")
            const end_time = DateTime.fromISO(q.get("end_time") || "")
    
            if (!start_time.isValid || !end_time.isValid) {
                alert("something went wrong with the time")
                return
            }
    
            const carAddons: ReqBookingI['carAddons'] = []
            Array.from(q.entries()).forEach(([key, val]) => {
                if (key.startsWith("xAd.")) {
                    carAddons.push({
                        name: key.slice(4),
                        quantity: parseInt(val)
                    });
                }
            })
    
            const reqBooking: ReqBookingI = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
    
                vehicleId: carId,
                pickupAddress: {
                    street1: q.get("address") || "",
                    street2: "",
                    city: q.get("city") || "",
                    state: q.get("region") || "",
                    country: q.get("country") || "",
                    zipcode: q.get("zipcode") || "",
                    type: validateAddressType(q.get("addressType") as AddressType),
                },
                sameAsPickup: true,
                startTime: {
                    local: start_time.toISO(),
                    iana: timezone
                },
                endTime: {
                    local: end_time.toISO()!,
                    iana: timezone
                },
                carAddons
            }
    
            const res = await createBooking(reqBooking)
            if (res.isErr) {
                alert("Something went wrong with requesting new booking")
                return
            }
    
            router.push(`/checkout/${res.data.id}`)
        } finally {
            setLoading(false)
        }
    }
    
    if (loading) {
        <main
            className="mx-2 md:mx-auto rounded-2xl max-w-4xl border-black border-2 p-2 md:p-4 relative"
        >
            <div className='h-full w-full flex justify-center items-center'>
                <h1 className='font-bold text-2xl text-center'>
                    Loading...
                </h1>
            </div>
        </main>
    }

    return (
        <Suspense>
            <main
                className="mx-2 md:mx-auto rounded-2xl max-w-4xl border-black border-2 p-2 md:p-4 relative"
            >
                <div
                    className={`flex justify-evenly rounded-md border-black border-2 text-center text-lg font-bold md:mx-auto md:max-w-2xl`}
                >
                    <button
                        className={`border-r-2 p-2 border-black w-full ${isNewUser && activeChoice1}`}
                        onClick={() => setIsNewUser(true)}
                    >
                        New User
                    </button>
                    <button
                        className={`w-full ${!isNewUser && activeChoice1}`}
                        onClick={() => setIsNewUser(false)}
                    >
                        Login
                    </button>
                </div>
                {isNewUser && <RentalNewUser 
                        toggle={() => setIsNewUser(false)}
                        handleBooking={() => handleBooking()}
                    />
                }
                {!isNewUser && <RentalLoginUser 
                        handleBooking={() => handleBooking()}
                    />
                }
            </main>
        </Suspense>
    )
}

export default GetUserMain