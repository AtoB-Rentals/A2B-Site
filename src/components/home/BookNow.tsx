'use client'
import Image from "next/image"
import { DateTime } from 'luxon'
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import AutoComplete from 'react-google-autocomplete';
import { FilterShema } from "../modals/public_cars/filter";
import useBasicFormHook from "@/hooks/useForm";
import { useState } from "react";
import { GeocodeResultI, parseGeocodeResult } from "@/constants/location/googleRequest";
import { inThirty } from "@/constants/formatting/time";

const BookNow = () => {
    const [ airportSearch, setAirportSearch ] = useState<boolean>(false)
    const [ selAddress, setSelAddress ] = useState<GeocodeResultI>()
    const router = useRouter()

    const currentDate = DateTime.now()
    const {
        updateValues,
        values,
        setValues
    } = useBasicFormHook(FilterShema, {
        address: "",
        "start_date": currentDate.plus({day: 1}).toFormat('yyyy-MM-dd'),
        "end_date": currentDate.plus({day: 3}).toFormat('yyyy-MM-dd'),
        "start_time": "9:00 AM",
        "end_time": "9:00 AM",
        type: ""
    }, undefined, "filter")

    

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const params = new URLSearchParams()

        Object.keys(values).forEach(key => {
            if (key === "address" && airportSearch ){
                params.set("airport", values[key]!)
                return
            }

            //@ts-ignore
            params.set(key, values[key]!)

            
        })

        router.push(`/rentals?${params.toString()}`)
    }

    return (
        <section className="w-full p-10">
            <div className="text-center mb-8">
                <h2 className="text-4xl">
                    Make A Booking
                </h2>
            </div>
            <form 
                className="p-6 lg:p-8 flex flex-col lg:flex-row items-center md:items-start justify-start md:justify-between gap-3 w-full bg-white text-neutral-700 text-xl"
                onSubmit={e => handleSubmit(e)}
            >
                <div className="text-center lg:text-left">
                    <label 
                        htmlFor="pickupAddress"
                        className="font-bold justify-center"
                    >
                        Location
                    </label>
                    {!airportSearch && <AutoComplete
                        className="border rounded-md border-gray-600 p-1 w-full"
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
                        onChange={e => {
                            e.preventDefault()
                            //@ts-ignore
                            setValues(prev => ({...prev, address: e.target.value}))
                        }}
                        options={{
                            types: ["(regions)"]
                        }}
                        onPlaceSelected={data => {
                            const res = parseGeocodeResult(data)
                            if (res === null) {
                                alert("something went wrong. Please try again later")
                                return
                            }

                            setValues(prev => ({
                                ...prev,
                                address: data.formatted_address
                            }))

                            setSelAddress(res)
                        }}
                    />}
                    {airportSearch && <AutoComplete
                        className="border rounded-md border-gray-600 p-1 w-full"
                        placeholder="Search Airport"
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
                        onChange={e => {
                            e.preventDefault()
                            //@ts-ignore
                            setValues(prev => ({...prev, address: e.target.value}))
                        }}
                        options={{
                            types: ["airport"]
                        }}
                        onPlaceSelected={data => {
                            const res = parseGeocodeResult(data)
                            if (res === null) {
                                alert("something went wrong. Please try again later")
                                return
                            }

                            setValues(prev => ({
                                ...prev,
                                address: data.formatted_address
                            }))

                            setSelAddress(res)
                        }}
                    />}
                    <div className="flex gap-2">
                        <input 
                            type="checkbox" 
                            name="airport" 
                            id="airport"
                            checked={airportSearch}
                            onChange={() => setAirportSearch(!airportSearch)}
                        />
                        <label htmlFor="airport">Search Airport</label>
                    </div>
                </div>
                <div className="text-center lg:text-left">
                    <div>
                        <label 
                            htmlFor="start_date"
                            className="font-bold text-center lg:text-left"
                        >
                            From
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="date" 
                                name="start_date" 
                                id="start_date"
                                className="bg-transparent active:border-neutral-900 w-full text-center lg:text-left"
                                value={values['start_date']}
                                onChange={updateValues}
                            />
                        </div>
                    </div>
                    <div>
                        <label 
                            htmlFor="start_date"
                            className="font-bold text-center lg:text-left"
                        >
                            
                        </label>
                        <div className="flex gap-2">
                            <select 
                                name="start_time" 
                                id="start_time"
                                className="w-full p-1 rounded-md border border-gray-600"
                                value={values.start_time}
                                onChange={e => setValues(prev => ({...prev, start_time: e.target.value}))}
                            >
                                {inThirty.map(t => (
                                    <option key={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="text-center lg:text-left">
                    <div>
                        <label 
                            htmlFor="end_date"
                            className="font-bold text-center lg:text-left"
                        >
                            Until
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="date" 
                                name="end_date"
                                id="end_date"
                                placeholder="until"
                                className="bg-transparent active:border-neutral-900 w-full text-center lg:text-left"
                                value={values['end_date']}
                                onChange={updateValues}
                            />
                        </div>
                    </div>
                    <div>
                        <select 
                            name="end_time" 
                            id="end_time"
                            className="w-full p-1 rounded-md border border-gray-600"
                            value={values.end_time}
                            onChange={e => setValues(prev => ({...prev, end_time: e.target.value}))}
                        >
                            {inThirty.map(t => (
                                <option key={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <input
                    type="submit"
                    className="p-4 bg-orange-500 text-white w-full lg:w-auto lg:min-w-fit"
                    value="Rent Now"
                />
            </form>
        </section>
    )
}

export default BookNow