import { BookingI, ReqBookingI, StripeBookingI } from "@/interface/api/booking";
import { ApiRes, apiURL, err, throwError, unknownErr } from "./constants";
import { ReqAddressI } from "@/interface/api/address";
import { ReqUserI } from "@/interface/api/user";

export const createBooking = async (req: ReqBookingI): Promise<ApiRes<BookingI> | err> => {
    try {
        const res = await fetch(`${apiURL}/api/bookings/`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(req)
        })
    
        if (!res.ok) {
            const errorData = await res.json() as err
            return throwError(
                res,
                errorData
            )
        }

        return await res.json() as ApiRes<BookingI>
    } catch {
        return unknownErr()
    }
}

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

export const bookingPaymentIntent = async (bookingId: string): Promise<ApiRes<StripeBookingI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/bookings/${bookingId}/payment_intent`, { 
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
    
        return await response.json() as ApiRes<StripeBookingI>
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

export const cancelBooking = async (
    bookingId: string,
    body: {
        reason: string
        refund: boolean
        /**
         * **Leave refund as 0 if not a manager
         */
        refundAmount: number
    }
): Promise<ApiRes<BookingI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/bookings/${bookingId}/cancel`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
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

export const RemBooking = async (bookingId: string): Promise<ApiRes<BookingI> | err> => {
    try {
        const response = await fetch(`${apiURL}/api/bookings/${bookingId}`, { 
            method: 'DELETE',
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

export const calcDistance = async (
    originPlaceId: string,
    destinationPlaceId: string
): Promise<number | null> => {
    const url = `${apiURL}/api/bookings/calc_distance?origin=${originPlaceId}&destination=${destinationPlaceId}`

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const data = await response.json();

        console.log("Distance Data: ", data)
        return data.data as number
    } catch (error) {
        console.error('Error fetching distance data:', error);
        return null
    }
}

export const updateRenter = async (bookingId: string, reqRenter: ReqUserI): Promise<ApiRes<BookingI> | err> => {

    try {
        const response = await fetch(`${apiURL}/api/bookings/${bookingId}/renter`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ ...reqRenter })
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