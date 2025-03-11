'use client'

import Loading from "@/components/assets/loading";
import { inThirty, timeFormat, timeUserFormat } from "@/constants/formatting/time";
import carScheduleHook from "@/hooks/CarScheduleHook";
import Link from "next/link";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css"

const BookingSechedule = ({carId}: {carId: string}) => {
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
                                <p>{timeFormat(record.startTime, timeUserFormat)}</p>
                                <p>{timeFormat(record.endTime, timeUserFormat)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default BookingSechedule