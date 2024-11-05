

// type ReqAddress struct {
// 	Street1 string `bson:"street_address_line_1" json:"street1" validate:"required"`
// 	Street2 string `bson:"street_address_line_2" json:"street2"`
// 	City    string `bson:"city" json:"city" validate:"required"`
// 	State   string `bson:"state" json:"state" validate:"required"`
// 	Zipcode string `bson:"zipcode" json:"zipcode" validate:"required"`
// 	Country string `bson:"country" json:"country" validate:"required"`
// }

import { z } from "zod"

/**[Longitude, Latitude] */
export type CoordinatesT = [
    /**Longitude */
    number,
    /**Latitude */
    number
]

export type GeoT = 
    | "Point"
    | "LineString"
    | "Polygon"
    | "center"

export type AddressType = 
    | "Airport"
    | "Default"
    /**Area mean that is a city are location. This will be parsed as Default when sent to api */
    | "Area"

export const addressTypes: AddressType[] = [
    "Airport",
    "Default",
    "Area"
] as const 

/**Returns default if the address to is invalid */
export const validateAddressType = (type: string): AddressType => {
    return addressTypes.includes(type as AddressType) ? type as AddressType : "Default"
}

export interface ReqAddressI {
    street1: string
    street2: string
    city: string
    state: string
    zipcode: string
    country: string
    type: AddressType
    index?: string
}

export const ReqAddressSchema = z.object({
    street1: z.string().min(1, "Street line 1 is required"),    // Must be a non-empty string
    street2: z.string().optional(),                       // Optional field, can be empty
    city: z.string().min(1, "City is required"),          // Must be a non-empty string
    state: z.string().min(1, "State is required"),        // Must be a non-empty string
    zipcode: z.string().min(5, "Zipcode must be at least 5 characters"),  // Minimum length of 5 characters
    country: z.string().min(1, "Country is required"),     // Must be a non-empty string
    type: z.string().refine(value => {
        return value.includes(value)
    }, "Invalid address type").optional(),
    index: z.string().optional()
})

export const reqAddressEmpty: ReqAddressI = {
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    type: "Default",
    index: ""
}

export interface AddressI {
    placeId: string
    street1: string
    street2: string
    city: string
    state: string
    zipcode: string
    country: string
    formatted: string
    geo: {
        type: GeoT
        coordinates: CoordinatesT
    }
    url: string
    type: AddressType
    /**Store things like the airport id here */
    index?: string
} 