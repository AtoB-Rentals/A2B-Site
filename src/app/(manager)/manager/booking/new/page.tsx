'use client'

import Loading from "@/components/assets/loading"
import Vehicle from "@/components/bookings/manager/bookingProfile/Vehicle"
import Addons from "@/components/bookings/manager/CreateBooking/addons/Addons"
import Address from "@/components/bookings/manager/CreateBooking/address/Address"
import BookingSection from "@/components/bookings/manager/CreateBooking/booking/Booking"
import BookingSechedule from "@/components/bookings/manager/CreateBooking/Schedule"
import { bookingPaymentIntent, createBooking, getBookingById } from "@/constants/requests/bookings"
import { getCar } from "@/constants/requests/cars"
import { PickDropI, ReqAddressI } from "@/interface/api/address"
import { BookingI, ReqBookingI } from "@/interface/api/booking"
import { CarI } from "@/interface/api/car"
import { ScheduleI } from "@/interface/api/time"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const CreateBooking = () => {
    const q = useSearchParams()
    const [ car, setCar ] = useState<CarI>()
    const [ schedule, setSchedule ] = useState<ScheduleI>()
    const [ addresses, setAddresses ] = useState<PickDropI>({
        pickup: null,
        dropoff: null
    })
    const [addons, setAddons] = useState<BookingI["addons"]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [booking, setBooking] = useState<BookingI>()

    const getVehicle = async (carId: string) => {
        try {
            const res = await getCar(carId)
            if (res.isErr) {
                if (res.status === 500) {
                    return alert("An error occurred. Please try again later.")
                }
            }
    
            setCar(res.data)
        } finally {
            setLoading(false)
        }
    }

    const handleQ = () => {
        if (q.has('car_id')) {
            const id = q.get('car_id')
            if (car && car.id !== id && id) {
                getVehicle(id)
            }
        }

        getVehicle(q.get('car_id') || "")
    }

    useEffect(() => {
        handleQ()
    }, [q])

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

    const handleCreateBooking = async () => {
        if (!car) return alert("No car selected")
        if (!addresses.pickup) return alert("Please select a pickup address")
        if (!schedule?.start && !schedule?.end) return alert("Please select a schedule")
        if (addresses.dropoff === null) return alert("Please select a dropoff address")

        const booking: ReqBookingI = {
            vehicleId: car.id,
            startTime: {
                local: schedule.start.toISO()!,
                iana: tz,
            },
            endTime: {
                local: schedule.end.toISO()!,
                iana: tz,
            },
            pickupAddress: addresses.pickup as ReqAddressI,
            dropoffAddress: addresses.dropoff as ReqAddressI,
            addons: addons.map(addon => ({
                name: addon.name,
                quantity: addon.quantity,
                amount: addon.amount,
                description: addon.description
            })),
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            sameAsPickup: false
        }

        let res = await createBooking(booking)
        if (res.isErr) {
            if (res.status === 500) {
                return alert("An error occurred. Please try again later.")
            }
            if (res.status === 400) {
                return alert(res.data.message)
            }

            return
        }

        const intentRes = await bookingPaymentIntent(res.data.id)
        if (intentRes.isErr) {
            if (intentRes.status === 500) {
                return alert("An error occurred. Please try again later.")
            }
            if (intentRes.status === 400) {
                return alert(intentRes.data.message)
            }

            return
        }

        const bookingRes = await getBookingById(res.data.id)
        if (bookingRes.isErr) {
            if (bookingRes.status === 500) {
                return alert("An error occurred. Please try again later.")
            }
            if (bookingRes.status === 400) {
                return alert(bookingRes.data.message)
            }

            return
        }

        setBooking(bookingRes.data)
    }

    if (loading) return (
        <main className="flex justify-center items-center h-[80vh]">
            <Loading />
        </main>
    )

    const checkoutUrl: string = booking ? `${window.location.origin}/checkout/${booking?.id}` : ""

    return (
        <main className="mb-56">        
            <section className="rounded-md shadow-[0px_0px_4px_1px] shadow-gray-400 mb-4 overflow-hidden p-3 mx-2 md:mx-auto max-w-[1000px]">
                <section className="text-center">
                    <h1 className="font-bold text-primary text-2xl">Create Booking</h1>
                </section>
                {car && <Vehicle {...car} />}
                {/* BOOKING SCHEDULING AND RECORDS */}
                <BookingSechedule 
                    carId={car?.id} 
                    updateSchedule={(schedule: ScheduleI) => setSchedule(schedule)}
                />
                {/* Address Section */}
                <Address 
                    car={car} 
                    addresses={addresses} 
                    updateAddresses={(addresses: PickDropI) => setAddresses(addresses)}
                />

                {/* Add Ons */}
                {car && <Addons 
                    car={car}
                    addons={addons}
                    updateAddons={(addons: BookingI["addons"]) => setAddons(addons)}
                    addresses={addresses}
                />}
                
                {/* create booking button */}
                <div className="flex justify-center items-center mt-4 w-full">
                    <button 
                        className="btn btn-primary w-full md:w-1/4 text-lg font-bold"
                        onClick={() => handleCreateBooking()}
                    >
                        Create Booking
                    </button>
                </div>
            </section>
            {/* Booking Section */}
            <section className="">
                {booking && <BookingSection booking={booking} />}
                <div className="flex justify-center flex-col items-center mt-4 w-full text-center break-words mx-2">
                    <p className="text-wrap text-ellipsis w-3/4 md:w-1/4 font-bold">
                        checkout url: <span className="text-primary">
                            {checkoutUrl}
                            </span>
                        </p>
                    <button
                        className="btn btn-success md:w-1/4 text-lg font-bold"
                        onClick={() => navigator.clipboard.writeText(checkoutUrl)}
                    >
                        Copy URL
                    </button>
                </div>
            </section>
        </main>
    )
}

export default CreateBooking