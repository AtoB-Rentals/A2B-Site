import { z } from "zod"


export interface BookingRequestBody {
    firstName: string
    lastName: string
    phone: string
    email: string
    insuranceProvider: string
    phoneNumber: string
    policyNumber: string
    startTime: {
        local: string
        iana: string
    }
    endTime: {
        local: string
        iana: string
    }
    dropoffAddress: string
    pickupAddress: string
}

// type PostTime struct {
// 	Local string `json:"local" validate:"required"`
// 	IANA  string `json:"iana" validate:"required"`
// }
