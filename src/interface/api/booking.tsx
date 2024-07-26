import { z } from "zod"


export interface BookingRequestBody {
    firstName: string
    lastName: string
    phone: string
    email: string
    insuranceProvider: string
    policyNumber: string
    startDate: string
    endDate: string
    dropoffAddress: string
    pickupAddress: string
}
