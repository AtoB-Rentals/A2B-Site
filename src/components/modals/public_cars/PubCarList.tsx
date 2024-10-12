'use client'
import { CarI } from '@/interface/api/car'
import { useState, useEffect } from 'react'
import CarCard from './CarCard'
import { useSearchParams } from 'next/navigation'
import { getCars } from '@/constants/requests/cars'
import { DateTime } from 'luxon'

const PubCarList = () => {
    const [ cars, setCars ] = useState<CarI[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const q = useSearchParams();

    const handleGetCars = async () => {
        const timeFormat = "yyyy-MM-dd t"
        const start_time = DateTime.fromFormat(
            `${q.get("start_date")} ${q.get("start_time")}`,
            timeFormat
        )
        console.log('test start_time: ', start_time.isValid)

        const end_time = DateTime.fromFormat(
            `${q.get("end_date")} ${q.get("end_time")}`,
            timeFormat
        )

        console.log("start: ", `${q.get("start_date")} ${q.get("start_time")}`)
        console.log("end: ", `${q.get("end_date")} ${q.get("end_time")}`)

        if (!start_time.isValid || !end_time.isValid) {
            console.log("fail")
            return
        }

        console.log("pass")

        try {
            const res = await getCars({
                city: q.get("city") || undefined,
                state: q.get("state") || undefined,
                start_time: start_time.toUTC().toISO(),
                end_time: end_time.toUTC().toISO()
            })

            if (res.isErr) {
                alert("Something went wrong please try again later")
                return
            }

            setCars(res.data)
        } catch {
            alert("Something went wrong please try again later")
        }
    }

    useEffect(() => {
        handleGetCars()
    }, [q])

    return (
        <>
            {cars.map(c => (
                <CarCard
                    c={c}
                    key={c.id}
                />
            ))}
            {!cars.length && !loading && <p className="text-2xl font-bold text-center">
                Available cars not found
            </p>}
        </>
    )
}

export default PubCarList