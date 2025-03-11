'use client'

import Loading from "@/components/assets/loading"
import Vehicle from "@/components/bookings/manager/bookingProfile/Vehicle"
import CarSect from "@/components/bookings/manager/CreateBooking/CarSect"
import BookingSechedule from "@/components/bookings/manager/CreateBooking/Schedule"
import { getCar } from "@/constants/requests/cars"
import { CarI } from "@/interface/api/car"
import { get } from "http"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const CreateBooking = () => {
    const q = useSearchParams()
    const [ car, setCar ] = useState<CarI>()
    const [loading, setLoading] = useState<boolean>(true)

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
            console.log("done")
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
    }, [])

    useEffect(() => {
        handleQ()
    }, [q])

    if (loading) return (
        <main className="flex justify-center items-center h-[80vh]">
            <Loading />
        </main>
    )

    return (
        <main className="rounded-md shadow-[0px_0px_4px_1px] shadow-gray-400 overflow-hidden p-3 mb-56 mx-2 md:mx-auto max-w-[1000px]">
            <section className="text-center">
                <h1 className="font-bold text-primary text-2xl">Create Booking</h1>
            </section>
            {car && <Vehicle {...car} />}
            {car && <BookingSechedule carId={car?.id} /> }
        </main>
    )
}

export default CreateBooking