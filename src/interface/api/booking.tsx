import { string, z } from "zod"
import { AddressI, ReqAddressI } from "./address"
import { CarI } from "./car"
import { TimeI } from "./time"
import { UserI } from "./user"
import { InvoiceItemI } from "./invoice"

export type BookingStatusT = 
    | "Scheduled"
    | "In Progress"
    | "Cancelled"
    | "Complete"
    | "Draft"
    | "Blocked"

export const BookingStatuses: BookingStatusT[] = [
    'Cancelled',
    'Complete',
    'In Progress',
    'Scheduled',
    'Blocked',
    'Draft',
] as const

export interface ReqBookingI {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    vehicleId: CarI["id"]
    sameAsPickup: boolean
    startTime: {
        local: string
        iana: string
    }
    endTime: {
        local: string
        iana: string
    }
    dropoffAddress?: ReqAddressI
    pickupAddress: ReqAddressI

    carAddons?: {
        name: string
        quantity: number
    }[]
}

export interface StripeBookingI {
    invoiceId: string
    paymentIntentId: string
    clientSecret: string
    invoiceURL: string
    items: InvoiceItemI[]
}
export interface BookingI {
    id: string
    firstName: string
    lastName: string
    phone: string
    email: string
    renter: UserI
    insuranceProvider: string
    phoneNumber: string
    policyNumber: string
    startTime: TimeI
    endTime: TimeI
    totalPrice: number
    vehicle: CarI

    carAddons: {
        name: string
        quantity: number
    }[]

    dropOffAddress: AddressI
    pickupAddress: AddressI

    status: BookingStatusT
    stripe: StripeBookingI
}

const ReqBookingSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    insuranceProvider: z.string().optional(),
    policyNumber: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    dropoffAddress: z.string().optional(),
    pickupAddress: z.string().optional(),
})

// type PostTime struct {
// 	Local string `json:"local" validate:"required"`
// 	IANA  string `json:"iana" validate:"required"`
// }

export interface RecordI {
    startTime: TimeI
    endTime: TimeI
    status: BookingStatusT
}