"use client"

import { blockCar, getCar, getCarSchedule } from "@/constants/requests/cars"
import { RecordI } from "@/interface/api/booking"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { DateRange, DayPicker } from "react-day-picker"
import FormModal from "./formModal"
import "react-day-picker/style.css"
import { inThirty } from "@/constants/formatting/time"
import { useSearchParams } from "next/navigation"
import { CarI } from "@/interface/api/car"

const ScheduleBlockCarPop = ({pCarId}: {
    pCarId?: string
}) => {
    const q = useSearchParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [ car, setCar ] = useState<CarI | null>(null)
    const [records, setRecords] = useState<RecordI[]>([])
    const [ dates, setDates ] = useState<DateRange>()
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

    const [ start, setStart ] = useState<DateTime | null>(null)
    const [ end, setEnd ] = useState<DateTime | null>(null)

    const [ times, setTimes ] = useState<{start: string, end: string}>({
            start: "9:30 AM",
            end: "9:30 AM"
    })

    const handleGetRecords = async (id: string) => {
        if (!id) return

        try {
            setLoading(true)
            const res = await getCarSchedule(id)
            if (res.isErr) {
                alert("something when wrong")
            }
            setRecords(res.data)
        }
        finally {
            setLoading(false)
        }
    }

    const handleGetCar = async (id: string) => {
        if (!id) return

        try {
            setLoading(true)
            const res = await getCar(id)
            if (res.isErr) {
                alert("something when wrong")
            }
            setCar(res.data)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const carId = q.get('car_id') || pCarId || ""
        handleGetCar(carId)
        handleGetRecords(carId)
    }, [ q ])

    useEffect(() => {
        const timeFormat = "yyyy-MM-dd t"
        if (dates === undefined || dates.from === undefined || dates.to === undefined) {
            return
        }

        const start_date = DateTime.fromJSDate(dates.from).toFormat("yyyy-MM-dd")
        const start_time = DateTime.fromFormat(`${start_date} ${times.start}`, timeFormat)
        
        const end_date = DateTime.fromJSDate(dates.to).toFormat("yyyy-MM-dd")
        const end_time = DateTime.fromFormat(`${end_date} ${times.end}`, timeFormat)

        setStart(start_time)
        setEnd(end_time)
    }, [times, dates])

    const handleBlockRental = async (): Promise<boolean> => {
        if (!car || !start || !end) return false
        setLoading(true)
        // do something
        try {
            const res = await blockCar(car.id, start.toISO()!, end.toISO()!, tz)
            
            if (res.isErr) {
                alert("Something went wrong")
                return false
            }

            return true
        } catch (e) {
            console.error(e)
            return false
        } finally {
            setLoading(false)
        }

        return false
    }

    const ranges = records ? records.map(r => ({
        from: DateTime.fromISO(r.startTime.utc, {zone:'utc'}).setZone(tz).toJSDate(),
        to: DateTime.fromISO(r.endTime.utc, {zone:'utc'}).setZone(tz).toJSDate()
    })) : []

    return (
        <FormModal
            title="Block Rental"
            paramKey="block_rental"
            onOk={ () => handleBlockRental() }
            loading={ loading }
        >
            
            {car !== null && <div className="h-96">
                <h2 className="text-2xl font-bold text-center">
                    {car.name}
                </h2>
                <div className="mx-auto w-full max-w-[500px] p-4">
                    <div className="flex justify-center">
                        <DayPicker 
                            mode="range" 
                            disabled={[
                                { before: new Date() },
                                ...ranges
                            ]}
                            selected={ dates }
                            onSelect={e => {
                                if (e) setDates(e)
                            }}
                            className=""
                        />
                    </div>
                    <div className="flex justify-around w-full">
                        <div className="flex flex-col">
                            <label 
                                htmlFor="start_time"
                                className="font-bold"
                            >
                                Start Time
                            </label>
                            <select 
                                name="startTime" 
                                id="startTime"
                                value={times.start}
                                onChange={e => setTimes(p => ({...p, start: e.target.value}))}
                                className="select"
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
                                End Time
                            </label>
                            <select 
                                name="endTime" 
                                id="endTime"
                                value={times.end}
                                onChange={e => setTimes(p => ({...p, end: e.target.value}))}
                                className="select"
                            >
                                {inThirty.map(t => <option key={t}>
                                    {t}
                                </option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>}
        </FormModal>
    )
}

export default ScheduleBlockCarPop