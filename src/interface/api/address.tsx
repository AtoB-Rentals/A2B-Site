

// type ReqAddress struct {
// 	Street1 string `bson:"street_address_line_1" json:"street1" validate:"required"`
// 	Street2 string `bson:"street_address_line_2" json:"street2"`
// 	City    string `bson:"city" json:"city" validate:"required"`
// 	State   string `bson:"state" json:"state" validate:"required"`
// 	Zipcode string `bson:"zipcode" json:"zipcode" validate:"required"`
// 	Country string `bson:"country" json:"country" validate:"required"`
// }

import { z } from "zod"

// type GeoCoordinates [2]float64

// var PointType = struct {
// 	Point      string
// 	LineString string
// 	Polygon    string
// 	Center     string
// }{
// 	Point:      "Point",
// 	LineString: "LineString",
// 	Polygon:    "Polygon",
// 	Center:     "center",
// }

// type Point struct {
// 	//use addressModel.PointType
// 	Type string `bson:"type" json:"type"`
// 	//[Longitude, Latitude] - This is very important for mongoDB
// 	Coordinates GeoCoordinates `bson:"coordinates" json:"coordinates"`
// }

// type Address struct {
// 	PlaceId   string `bson:"place_id" json:"placeId"`
// 	Street1   string `bson:"street_address_line_1" json:"street1" validate:"required"`
// 	Street2   string `bson:"street_address_line_2" json:"street2"`
// 	City      string `bson:"city" json:"city" validate:"required"`
// 	State     string `bson:"state" json:"state" validate:"required"`
// 	Zipcode   string `bson:"zipcode" json:"zipcode" validate:"required"`
// 	Country   string `bson:"country" json:"country" validate:"required"`
// 	Formatted string `bson:"formatted" json:"formatted"`
// 	Geo       Point  `bson:"geo" json:"geo"`
// 	URL       string `bson:"url" json:"url"`
// }

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

export interface ReqAddressI {
    street1: string
    street2: string
    city: string
    state: string
    zipcode: string
    country: string
}

export const ReqAddressSchema = z.object({
    street1: z.string().min(1, "Street line 1 is required"),    // Must be a non-empty string
    street2: z.string().optional(),                       // Optional field, can be empty
    city: z.string().min(1, "City is required"),          // Must be a non-empty string
    state: z.string().min(1, "State is required"),        // Must be a non-empty string
    zipcode: z.string().min(5, "Zipcode must be at least 5 characters"),  // Minimum length of 5 characters
    country: z.string().min(1, "Country is required")     // Must be a non-empty string
})

export const reqAddressEmpty= {
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipcode: "",
    country: ""
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
} 