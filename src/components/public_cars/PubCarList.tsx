'use client'
import { CarI } from '@/interface/api/car'
import { useState, useEffect, Suspense } from 'react'
import CarCard from './CarCard'
import { useSearchParams } from 'next/navigation'
import { getCars } from '@/constants/requests/cars'
import { DateTime } from 'luxon'
import { objectToQueryString } from '@/constants/requests/constants'
import { validateAddressType } from '@/interface/api/address'
import Loading from '../assets/loading'

const PubCarList = () => {
    const [ cars, setCars ] = useState<CarI[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const q = useSearchParams()

    const handleQTime = (): {
        start_time: DateTime,
        end_time: DateTime,
        isValid: boolean
    } => {
        const timeFormat = "yyyy-MM-dd t"
        const start_time = DateTime.fromISO(q.get("start_time") || "")
        const end_time = DateTime.fromISO(q.get("end_time") || "")

        return {
            start_time,
            end_time,
            isValid: start_time.isValid && end_time.isValid
        }
    }

    const { start_time, end_time, isValid } = handleQTime()

    const handleGetCars = async () => {
        if (!isValid) {
            return
        }

        try {
            setLoading(true)
            const res = await getCars({
                city: q.get("city") || undefined,
                state: q.get("region") || undefined,
                start_time: start_time.toUTC().toISO(),
                end_time: end_time.toUTC().toISO(),
                type: q.get("type") || undefined,
                address: q.get('address') || undefined
            })

            if (res.isErr) {
                alert("Something went wrong please try again later")
                return
            }

            setCars(res.data)
        } catch {
            alert("Something went wrong please try again later")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetCars()
    }, [q])

    let carParams = ""
    if (isValid) {
        carParams = objectToQueryString({
            start_time: start_time.setZone('utc').toISO(),
            end_time: end_time.setZone('utc').toISO(),
            address: q.get("address")
            // place
        }) || ""
    }

    if (loading) return <Loading />

    return (
        <Suspense>
            {cars.map(c => (
                <CarCard
                    key={c.id}
                    c={c}
                    qParams={q.toString()}
                />
            ))}
            {!cars.length && !loading && <p className="text-2xl font-bold text-center">
                Available cars not found
            </p>}
        </Suspense>
    )
}

export default PubCarList