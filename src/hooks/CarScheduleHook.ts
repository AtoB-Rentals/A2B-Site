'use client'

import { getCar, getCarSchedule } from "@/constants/requests/cars"
import { RecordI } from "@/interface/api/booking"
import { CarI } from "@/interface/api/car"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"

const CarScheduleHook = (carId: string | undefined) => {
    const [records, setRecords] = useState<RecordI[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

    const handleGetRecords = async (id: string) => {
        if (!id) return

        try {
            setLoading(true)
            const res = await getCarSchedule(id)
            if (res.isErr) {
                console.log("handleGetRecords error", res.message)
            }
            setRecords(res.data)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (carId) {
            handleGetRecords(carId)
        }
    }, [carId])

    const ranges = records ? records.map(r => ({
        from: DateTime.fromISO(r.startTime.utc, { zone: 'utc' }).setZone(tz).toJSDate(),
        to: DateTime.fromISO(r.endTime.utc, { zone: 'utc' }).setZone(tz).toJSDate()
    })) : []

    return [
        ranges,
        handleGetRecords,
        loading,
        records
    ] as const
}

export default CarScheduleHook