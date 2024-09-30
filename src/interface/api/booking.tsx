import { z } from "zod"
import { AddressI, ReqAddressI } from "./address"
import { CarI } from "./car"
import { TimeI } from "./time"
import { UserI } from "./user"


export interface BookingRequestBody {
    firstName: string
    lastName: string
    phone: string
    email: string
    phoneNumber: string
    vehicleId: CarI["id"]
    startTime: {
        local: string
        iana: string
    }
    endTime: {
        local: string
        iana: string
    }
    dropoffAddress: ReqAddressI
    pickupAddress: ReqAddressI
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

    vehicle: CarI

    dropoffAddress: AddressI
    pickupAddress: AddressI
}

// type PostTime struct {
// 	Local string `json:"local" validate:"required"`
// 	IANA  string `json:"iana" validate:"required"`
// }
