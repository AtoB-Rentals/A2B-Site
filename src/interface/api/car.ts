import { z } from "zod"

export const pictureTypes: PictureTypeT[] = [
    'Back',
    'Driver Side',
    'Front',
    'Interior',
    'Other',
    'Passenger side'
]

export type PictureTypeT = "Driver Side" |
    "Front" |
    "Back" |
    "Interior" |
    "Passenger side" |
    "Other"

export type CarTypeT = "SUV" |
    "Truck" |
    "Sedan"

export const carTypeList: CarTypeT[] = [
    "SUV",
    "Sedan",
    "Truck"
]

export const AddCarSchema = z.object({
    make: z.string().max(100).min(1, 'Make must be provided'),
    year: z.string().max(4, "Invalid Year").min(4, "Invalid Year"),
    model: z.string().max(50, "Invalid model"),
    type: z.string().refine(value => {
        return carTypeList.includes(value as CarTypeT)
    })
})

export interface PictureI {
    type: PictureTypeT
    url: string
    publicId: string
    folder: string
}

export interface AddCarI {
    make: string
    model: string
    year: string
    type: CarTypeT
}

export interface CarI {
    id: string
    createdAt: Date
    updatedAt: Date
    make: string
    model: string
    year: string
    type: CarTypeT
    pictures: PictureI[]
    name: string
    tags: string[]
    mainPicture: string
}