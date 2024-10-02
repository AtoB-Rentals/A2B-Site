'use client'
import { BookingI } from "@/interface/api/booking";
import { ApiRes, apiURL, err, throwError, unknownErr } from "./constants";
import { ReqAddressI } from "@/interface/api/address";


export const bookingsFromTodayOn = async () => {
    try {
        const response = await fetch(`${apiURL}/api/bookings/from_today_on`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            credentials: 'include'
        })
    
        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }
    
        return await response.json() as ApiRes<BookingI[]>
    } catch (e) {
        return unknownErr()
    }
}

export const getBookingById = async (bookingId: string): Promise<ApiRes<BookingI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/bookings/${bookingId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
    
        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }
    
        return await response.json() as ApiRes<BookingI>
    } catch (e) {
        return unknownErr()
    }
}

export const UpdatePickupAddress = async (
    bookingId: string, 
    address: ReqAddressI,
    isDropoff?: boolean
): Promise<ApiRes<BookingI> | err> => {
    try {
        const path = isDropoff ? "dropoff_address" : "pickup_address"

        const response = await fetch(`${apiURL}/api/bookings/${bookingId}/${path}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(address)
        })
    
        if (!response.ok) {
            const errorData = await response.json() as err
            return throwError(
                response,
                errorData
            )
        }
    
        return await response.json() as ApiRes<BookingI>
    } catch (e) {
        return unknownErr()
    }
}