'use client'

import { inThirty } from "@/constants/formatting/time"
import { getCarSchedule } from "@/constants/requests/cars"
import { RecordI } from "@/interface/api/time"
import { DateTime } from "luxon"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { DayPicker, DateRange } from 'react-day-picker'
import "react-day-picker/style.css"

interface RentalScheduleI {
    carId: string
}

const RentalSchedule = ({carId}: RentalScheduleI) => {
    const q = useSearchParams()

    
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const [ records, setRecords ] = useState<RecordI[]>([])
    const [ dates, setDates ] = useState<DateRange>(() => {
        const sDT = DateTime.fromISO(q.get('start_time') || "").setZone(tz)
        const eDT = DateTime.fromISO(q.get('end_time') || "").setZone(tz)

        return {
            from: sDT.isValid ? sDT.toJSDate() : undefined,
            to: eDT.isValid ? eDT.toJSDate() : undefined
        }
    })
    const [ times, setTimes ] = useState<{start: string, end: string}>(() => {

        const sDT = DateTime.fromISO(q.get('start_time') || "").setZone(tz)
        const eDT = DateTime.fromISO(q.get('end_time') || "").setZone(tz)

        return {
            start: sDT.isValid ? sDT.toFormat('t') : "9:30 AM",
            end: sDT.isValid ? eDT.toFormat('t') : "9:30 AM"
        }
    })

    const handleGetRecords = async () => {
        const res = await getCarSchedule(carId)
        if (res.isErr) {
            alert("something when wrong")
        }
        setRecords(res.data)
    }
    
    useEffect(() => {
        handleGetRecords()
    }, [])

    useEffect(() => {
        const timeFormat = "yyyy-MM-dd t"
        if (!dates.from || !dates.to) {
            return
        }

        const start_date = DateTime.fromJSDate(dates.from).toFormat("yyyy-MM-dd")
        const start_time = DateTime.fromFormat(`${start_date} ${times.start}`, timeFormat)
        
        const end_date = DateTime.fromJSDate(dates.to).toFormat("yyyy-MM-dd")
        const end_time = DateTime.fromFormat(`${end_date} ${times.end}`, timeFormat)

        const params = new URLSearchParams(`${q.toString()}`)

        params.set("start_time", start_time.toUTC().toISO()!)
        params.set("end_time", end_time.toUTC().toISO()!)

        window.history.replaceState({}, '', `?${params.toString()}`)
    }, [times, dates])

    const ranges = records ? records.map(r => ({
        from: DateTime.fromISO(r.startTime.utc, {zone:'utc'}).setZone(tz).toJSDate(),
        to: DateTime.fromISO(r.endTime.utc, {zone:'utc'}).setZone(tz).toJSDate()
    })) : []

    return (
        <Suspense>
            <div className="flex flex-col-reverse">
                <DayPicker 
                    mode="range" 
                    disabled={[
                        { before: new Date() },
                        ...ranges
                    ]}
                    defaultMonth={dates.from}
                    selected={dates}
                    onSelect={e => {
                        if (e) setDates(e)
                    }}
                />
                <div className="flex justify-around w-full">
                    <div className="flex flex-col">
                        <label 
                            htmlFor="start_time"
                            className="font-bold"
                        >
                            Pickup Time
                        </label>
                        <select 
                            name="startTime" 
                            id="startTime"
                            value={times.start}
                            onChange={e => setTimes(p => ({...p, start: e.target.value}))}
                        >
                            {inThirty.map(t => <option key={t}>
                                {t}
                            </option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label 
                            htmlFor="end_time"
                            className="font-bold"
                        >
                            Drop-off Time
                        </label>
                        <select 
                            name="endTime" 
                            id="endTime"
                            value={times.end}
                            onChange={e => setTimes(p => ({...p, end: e.target.value}))}
                        >
                            {inThirty.map(t => <option key={t}>
                                {t}
                            </option>)}
                        </select>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default RentalSchedule