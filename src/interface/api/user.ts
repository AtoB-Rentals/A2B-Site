import z from 'zod'
import { isMobilePhone, isEmail } from 'validator'
import { DateTime } from 'luxon'

// type ReqUser struct {
// 	FirstName string`bson:"first_name" json:"firstName" form:"firstName" validate:"required"`
// 	LastName  string`bson:"last_name" json:"lastName" form:"lastName" validate:"required"`
// 	Phone     string`bson:"phone" json:"phoneNumber" form:"phoneNumber" validate:"required"`
// 	Email     string`bson:"email" json:"email" form:"email" validate:"required,email"`
// }

// export const ReqAddressSchema = z.object({
//     street1: z.string().min(1, "Street line 1 is required"),    // Must be a non-empty string
//     street2: z.string().optional(),                       // Optional field, can be empty
//     city: z.string().min(1, "City is required"),          // Must be a non-empty string
//     state: z.string().min(1, "State is required"),        // Must be a non-empty string
//     zipcode: z.string().min(5, "Zipcode must be at least 5 characters"),  // Minimum length of 5 characters
//     country: z.string().min(1, "Country is required"),     // Must be a non-empty string
//     type: z.string().refine(value => {
//         return value.includes(value)
//     }, "Invalid address type").optional(),
//     index: z.string().optional()
// })

export interface ReqUserI {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    /**2006-01-02 */
    dob: string
}

export const ReqUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().refine(value => {
        return isMobilePhone(value)
    }, "Invalid phone number provided"),
    email: z.string().refine(value => {
        return isEmail(value)
    }, "Invalid email provided"),
    password: z.string().min(8, "Must be at least 8 characters"),
    dob: z.string().refine(value => {
        const date = DateTime.fromFormat(value, "yyyy-MM-dd")
        if (!date.isValid) return false
        // Get the current date
        const now = DateTime.now();

        // Calculate age by subtracting the years
        let age = now.year - date.year;

        // Adjust if the birthday hasn't occurred yet this year
        if (now < date.plus({ years: age })) {
            age--;
        }
        return age >= 18

    }, "You must be at least 18 years old")
})

export const reqUserInitialValues = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    dob: ''
}

export interface UserI {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    timezone: string
    /**2006-01-02 */
    dob: string
}