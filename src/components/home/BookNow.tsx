'use client'
import Image from "next/image"
import { DateTime } from 'luxon'
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import AutoComplete from 'react-google-autocomplete';
import { FilterShema } from "../public_cars/filter";
import useBasicFormHook from "@/hooks/useForm";
import { useEffect, useState } from "react";
import { GeocodeResultI, parseGeocodeResult } from "@/constants/location/googleRequest";
import { inThirty, timeFormFormat } from "@/constants/formatting/time";
import usePlaceautoComplete from "@/hooks/usePlaceAutocomplete";

const BookNow = () => {
    const [ airportSearch, setAirportSearch ] = useState<boolean>(false)
    const router = useRouter()

    const currentDate = DateTime.now()
    const {
        updateParams,
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

    const {
        input,
        setInput,
        handleGoogleSel,
        selAddress,
        predictions,
    } = usePlaceautoComplete({})

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const params = new URLSearchParams()

        const startTime = DateTime.fromFormat(`${values.start_date} ${values.start_time}`, timeFormFormat)
        const endTime = DateTime.fromFormat(`${values.end_date} ${values.end_time}`, timeFormFormat)

        params.set("start_time", startTime.toUTC().toISO() || "")
        params.set("end_time", endTime.toUTC().toISO() || "")
        params.set

        if (selAddress) {
            Object.keys(selAddress).forEach(key => {
                // @ts-ignore
                params.set(key, selAddress[key]!)
            })
        }
        
        params.set("addressType", values.type!)

        router.push(`/rentals?${params.toString()}`)
    }

    useEffect(() => {
        setValues(prev => ({...prev, address: input}))
    }, [input])

    useEffect(() => {
        if (selAddress?.type) {
            setValues(prev => ({...prev, addressType: selAddress.type}))
        }
    }, [selAddress])

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
                <div className="relative text-center lg:text-left max-w-96">
                    <label 
                        htmlFor="pickupAddress"
                        className="font-bold justify-center"
                    >
                        Location
                    </label>
                    <input
                        className="border rounded-md border-gray-600 inv p-1 w-full"
                        onChange={e => {
                            e.preventDefault()
                            setInput(e.target.value)
                        }}
                        placeholder="Where do you need the car?"
                        value={input}
                    />
                    <ul 
                        className={`absolute translate-y-1 rounded-md w-full bg-white border-2 border-black z-30 ${predictions.length ? 'visble' : 'invisible'}`}
                    >
                        {predictions.map(p => (
                            <li
                                key={p.place_id}
                                className="hover:bg-gray-200 p-1 cursor-pointer"
                                onClick={() => handleGoogleSel(p)}
                            >
                                {p.structured_formatting.main_text}
                            </li>
                        ))}
                    </ul>
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
                    className="p-4 bg-orange-500 text-white hover:text-orange-500 w-full lg:w-auto lg:min-w-fit cursor-pointer hover:bg-white border-2 border-orange-500 transition-all ease rounded-md"
                    value="Rent Now"
                />
            </form>
        </section>
    )
}

export default BookNow