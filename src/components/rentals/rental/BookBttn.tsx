"use client"

import { useEffect, useState } from "react"
import { UserI } from '../../../interface/api/user';
import { GetUserProfile } from "@/constants/requests/users";
import Cookies from "js-cookie";
import { cookies } from 'next/headers';
import { useRouter, useSearchParams } from "next/navigation";
import CreateUserModal from "./CreateUserModal";
import { ReqBookingI } from '../../../interface/api/booking';
import { AddressType, validateAddressType } from "@/interface/api/address";
import { DateTime } from "luxon";
import { createBooking } from "@/constants/requests/bookings";

const BookBttn = ({
    carId, timezone
}: {
    carId: string
    timezone: string
}) => {
    const router = useRouter()
    const q = useSearchParams()
    const [ user, setUser ] = useState<UserI>()

    const getUser = async () => {
        if (!Cookies.get("token")) {
            return
        }
        
        const res = await GetUserProfile()
        if (res.isErr) {
            if (res.status === 401|| res.status === 403) {
                Cookies.remove("token")
                Cookies.remove("tokenX")
            }
        }

        await setUser(res.data)
    }

    useEffect(() => {
        getUser()
    }, [])

    timezone = timezone === "" ? timezone : Intl.DateTimeFormat().resolvedOptions().timeZone

    const handleBookBttn = async () => {
        if (!Cookies.get("token")) {
            const params = new URLSearchParams(q.toString())
            // params.set("create_new_user", "y")
            // window.history.replaceState({}, '', `?${params.toString()}`)
            router.push(`/rental/${carId}/get_user?${params.toString()}`)
            return
        }

        if (!user) {
            await getUser()
        }
        if(!user) {
            alert("something went wrong")
            return
        }

        const start_time = DateTime.fromISO(q.get("start_time") || "")

        const end_time = DateTime.fromISO(q.get("end_time") || "")

        if (!start_time.isValid || !end_time.isValid) {
            alert("something went wrong with the time")
            return
        }

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
            }
        }

        const res = await createBooking(reqBooking)
        if (res.isErr) {
            alert("Something went wrong with requesting new booking")
            return
        }

        router.push(`/checkout/${res.data.id}`)
    }

    return (
        <>
            <button
                className="bg-blue-600 font-bold text-white text-xl p-3 rounded-md w-full"
                onClick={() => handleBookBttn()}
            >
                Book
            </button>
            <CreateUserModal 
                title="New User"
                callback={handleBookBttn}
                paramKey="create_new_user"
            />
        </>
    )
}

export default BookBttn