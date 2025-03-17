'use client'

import Loading from "@/components/assets/loading";
import { inThirty, timeFormat, timeUserFormat } from "@/constants/formatting/time";
import <Cap></Cap>arScheduleHook from "@/hooks/CarScheduleHook";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css"
import { ScheduleI } from '../../../../interface/api/time';
import { DateTime } from "luxon";

const BookingSechedule = ({
    carId,
    updateSchedule
}: {
    carId: string | undefined
    updateSchedule: (schedule: ScheduleI) => void
}) => {
    const [ dates, setDates ] = useState<DateRange>()
    const [ times, setTimes ] = useState<{start: string, end: string}>({
            start: "9:30 AM",
            end: "9:30 AM"
    })
    const [showRecords, setShowRecords] = useState<boolean>(false)

    const [
        ranges,
        handleGetRecords,
        recordsLoading,
        records
    ] = carScheduleHook(carId)

    useEffect(() => {
        const timeFormat = "yyyy-MM-dd t"
        
        if (!dates?.from || !dates?.to || !times?.start || !times?.end) return

        const start_date = DateTime.fromJSDate(dates.from).toFormat("yyyy-MM-dd")
        const start_time = DateTime.fromFormat(`${start_date} ${times.start}`, timeFormat)
        
        const end_date = DateTime.fromJSDate(dates.to).toFormat("yyyy-MM-dd")
        const end_time = DateTime.fromFormat(`${end_date} ${times.end}`, timeFormat)

        if (start_time.isValid && end_time.isValid) {
            updateSchedule({
                start: start_time,
                end: end_time
            })
        }
    }, [times, dates])

    useEffect(() => {
        if (recordsLoading) return
        if (carId) {
            handleGetRecords(carId)
        }
    }, [ carId ])

    if (recordsLoading) return <Loading />

    return (
        <>
            <div className="md:hidden mx-auto p-4 w-min mt-2 px-4 flex items-center justify-center gap-x-2 rounded-lg overflow-hidden shadow-[inset_0px_0px_10px_4px_#000000]">
                <button 
                    className={`btn ${!showRecords && "btn-secondary"}`}
                    onClick={() => setShowRecords(false)}
                >
                    Schedule
                </button>
                <button 
                    className={`btn ${showRecords && "btn-secondary"}`}
                    onClick={() => setShowRecords(true)}
                >
                    Records
                </button>
            </div>
            <section className="flex w-full justify-center md:justify-between my-4 md:flex-row max-h-[445px]">
                {/* SCHEDULE */}
                <div className="md:!block" style={{display: showRecords ? "none" : "block"}}>
                    <p className="font-bold text-primary text-center text-lg">Schedule</p>
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
                </div>
                {/* RECORDS */}
                <div className="md:!flex flex-col w-full gap-4" style={{display: showRecords ? "flex" : "none"}}>
                    <p className="font-bold text-primary text-center text-lg">Records</p>
                    {records.length === 0 && <p className="font-bold text-primary text-center text-lg">This vehicle is all clear!</p>}
                    <div className="w-full gap-4 flex flex-col overflow-y-auto">
                        {records.map(record => (
                            <Link 
                                key={record.bookingId}
                                className={`w-full p-4 rounded-box bg-base-300 gap-y-4 ${record.status === 'Scheduled' ? "border-2 border-success" : "border-2 border-error"}`}
                                href={`/manager/booking/${record.bookingId}`}
                                target="_blank"
                            >
                                <p 
                                    className={`font-weight text-lg ${record.status === 'Scheduled' ?"text-success" : "text-error"}`}
                                >{record.status}</p>
                                <div className="flex justify-between items-center text-lg text-center">
                                    <div>
                                        <p>
                                            {timeFormat(record.startTime, 'MM/dd/yyyy')}
                                        </p>
                                        <p>
                                            {timeFormat(record.startTime, 't')}
                                        </p>
                                    </div>
                                    <span className="block w-full h-1 rounded-full bg-gradient-to-r from-secondary to-primary mx-4"></span>
                                    <div>
                                        <p>
                                            {timeFormat(record.endTime, 'MM/dd/yyyy')}
                                        </p>
                                        <p>
                                            {timeFormat(record.endTime, 't')}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default BookingSechedule