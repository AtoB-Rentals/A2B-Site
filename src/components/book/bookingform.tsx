import { formDataToObject } from "@/constants/form"
import { BookingRequestBody } from "@/interface/api/booking"
import { parsePhoneNumber } from "libphonenumber-js"
import { DateTime } from "luxon"
import { redirect } from "next/navigation"
import { HTMLAttributes, InputHTMLAttributes } from "react"
import { InputType } from "zlib"


const Input = ({
    labelName,
    inputProps,
}: {
    labelName: string,
    inputProps: InputHTMLAttributes<HTMLInputElement>
}) => {

    return (
        <div className={`relative w-full`}>
            <input 
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-600 border-solid appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                {...inputProps}
                placeholder=" "
            />
            <label 
                htmlFor={inputProps.name} 
                className="absolute text-lg text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/3 rtl:peer-focus:left-auto start-1"
            >
                {labelName}
            </label>
        </div>
    )
}

const BookingForm: React.FC<BookingRequestBody & {startDate: string, endDate: string}> = ({
    firstName,
    lastName,
    phone,
    email,
    policyNumber,
    insuranceProvider,
    startDate,
    endDate,
    pickupAddress,
    dropoffAddress
}) => {
    const handleBookingForm = async (form: FormData) => {
        'use server'
        const phoneNumber = form.get('phoneNumber')
        if(typeof phoneNumber !== 'string' || !!!phoneNumber) {
            return
        }

        form.set(
            "phoneNumber",
            parsePhoneNumber(phoneNumber, 'US').format('E.164')
        )
        // const formObj = formDataToObject(form)

        const startDate = form.get("startDate")
        const endDate = form.get("endDate")
        const startTime = form.get("startTime")
        const endTime = form.get("endTime")

        const fmt = "yyyy-MM-dd HH:mm"
        const startDT = DateTime.fromFormat(
            startDate + " " + startTime,
            fmt
        )
        const endDT = DateTime.fromFormat(
            endDate + " " + endTime,
            fmt
        )

        console.log("startTime: ", startDate + " " + startTime)

        const body = {
            firstName: form.get("firstName"),
            lastName: form.get("lastName"),
            email: form.get("email"),
            phoneNumber: form.get("phoneNumber"),
            pickupAddress: form.get("pickupAddress"),
            dropoffAddress: form.get("dropoffAddress"),
            insuranceProvider: form.get("insuranceProvider"),
            policyNumber: form.get("policyNumber"),
            startTime: {
                local: startDT.toISO(),
                iana: "America/New_York"
            },
            endTime: {
                local: endDT.toISO(),
                iana: "America/New_York"
            },
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API!}/api/bookings`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(body as BookingRequestBody)
        })

        const data = await response.json() as ApiResponse

        if(response.status === 200) {
            redirect('/book/complete')
        }

        if (response.status === 400) {
            if(data.code === 'FIELD_VALIDATION_ERROR') {
                data.Data.forEach(error => {
                    console.log(`Field: ${error.field}, Error: ${error.error}`); 
                })
            }
            return
        }

        console.log("data: ", data)
    }

    console.log('pickupAddress', pickupAddress || 'nothin')

    return (
        <section className="my-6 mx-3 md:mx-auto max-w-[800px] rounded-2xl shadow-[0px_0px_12px_3px] py-8 shadow-neutral-500">
            <h2 className="text-center text-3xl">
                Book A Rental
            </h2>
            <form 
                action={handleBookingForm}
                className=" mx-auto mt-2 flex flex-col gap-6 px-10"
            >   
                <div>
                    <h3
                        className="font-extrabold"
                    >
                        Personal Information
                    </h3>
                    <p>
                        *First and last name should
                    </p>
                </div>
                <div className="w-full flex flex-col lg:flex-row justify-between gap-5">
                    <Input 
                        labelName="First Name"
                        inputProps={{
                            name:"firstName",
                            required: true,
                            type: "text",
                            "aria-required": true
                        }}
                    />
                    <Input 
                        labelName="Last Name"
                        inputProps={{
                            name:"lastName",
                            required: true,
                            type: "text",
                            "aria-required": true
                        }}
                    />
                </div>
                <Input 
                    labelName="Email"
                    inputProps={{
                        name:"email",
                        required: true,
                        type: "text",
                        "aria-required": true
                    }}
                />
                <Input 
                    labelName="Phone Number"
                    inputProps={{
                        name:"phoneNumber",
                        required: true,
                        type: "text",
                        "aria-required": true
                    }}
                />
                <div>
                    <h3
                        className="font-extrabold"
                    >
                        Schedule
                    </h3>
                    <p>*The timezone is EST</p>
                </div>
                <div className="w-full flex flex-col lg:flex-row justify-between gap-5">
                    <Input 
                        labelName="Pickup Date"
                        inputProps={{
                            name:"startDate",
                            required: true,
                            type: "date",
                            "aria-required": true,
                            defaultValue: startDate
                        }}
                    />
                    <Input 
                        labelName="Pickup Time"
                        inputProps={{
                            name:"startTime",
                            required: true,
                            type: "time",
                            "aria-required": true,
                            defaultValue: "12:00"
                        }}
                    />
                </div>
                <div className="w-full flex flex-col lg:flex-row justify-between gap-5">
                    <Input 
                        labelName="Drop-off Date"
                        inputProps={{
                            name:"endDate",
                            required: true,
                            type: "date",
                            "aria-required": true,
                            defaultValue: endDate
                        }}
                    />
                    <Input 
                        labelName="Drop-off Time"
                        inputProps={{
                            name:"endTime",
                            required: true,
                            type: "time",
                            "aria-required": true,
                            defaultValue:"12:00"
                        }}
                    />
                </div>
                <div>
                    <h3
                        className="font-extrabold"
                    >
                        Location Details
                    </h3>
                    <p>*We can have a vehicle ready for you at sponsored mechanic shops</p>
                </div>
                <Input 
                    labelName="Pickup Address"
                    inputProps={{
                        name:"pickupAddress",
                        required: true,
                        type: "text",
                        "aria-required": true,
                        defaultValue: pickupAddress === 'Delivery' ? '' : pickupAddress
                    }}
                />
                <Input 
                    labelName="Dropoff Address"
                    inputProps={{
                        name:"dropoffAddress",
                        required: true,
                        type: "text",
                        "aria-required": true,
                        defaultValue: dropoffAddress === 'Delivery' || !dropoffAddress ? '' : dropoffAddress
                    }}
                />
                {/* <div>
                    <h3
                        className="font-extrabold"
                    >
                        Insurance Information
                    </h3>
                    <p>*Insurance information must match name provided</p>
                </div>
                <Input 
                    labelName="Insurance Provider"
                    inputProps={{
                        name:"insuranceProvider",
                        required: true,
                        type: "text"
                    }}
                />
                <Input 
                    labelName="Policy Number"
                    inputProps={{
                        name:"policyNumber",
                        required: true,
                        type: "text"
                    }}
                /> */}
                
                <button 
                    type="submit"
                    className="w-full p-5 bg-orange-500 rounded-lg"
                >
                    Request
                </button>
            </form>
        </section>
    )
}

export default BookingForm