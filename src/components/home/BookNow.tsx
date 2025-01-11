'use client'
import { DateTime } from 'luxon'
import { useRouter } from 'next/navigation';
import { FilterShema } from "../public_cars/filter";
import useBasicFormHook from "@/hooks/useForm";
import { useEffect, useState } from "react";
import { inThirty, timeFormFormat } from "@/constants/formatting/time";
import usePlaceautoComplete from "@/hooks/usePlaceAutocomplete";

const BookNow = () => {
    const [ showPredictions, setShowPredictions ] = useState<boolean>(false)
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

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        // Check if the next element receiving focus is outside the dropdown container
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setShowPredictions(false);
        }
    }

    const handleFocus = () => {
        setShowPredictions(true);
    }

    return (
        <section className="w-full p-10">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-primary motion-preset-bounc">
                    Make A Booking
                </h2>
            </div>
            <form 
                className="p-6 lg:p-8 flex flex-col lg:flex-row items-center lg:items-start justify-start lg:justify-between gap-3 w-full"
                onSubmit={e => handleSubmit(e)}
            >
                {/* Address section */}
                <div className="relative text-center lg:text-left max-w-96 motion-preset-slide-up z-10" onBlur={handleBlur}>
                    <label 
                        htmlFor="pickupAddress"
                        className="font-bold justify-center"
                    >
                        Location
                    </label>
                    <input
                        tabIndex={0}
                        className="input border-2 input-bordered rounded-md w-full"
                        onChange={e => {
                            e.preventDefault()
                            setInput(e.target.value)
                        }}
                        placeholder="Where do you need the car?"
                        value={input}
                        onFocus={handleFocus} 
                    />
                    <ul
                        className={`!bg-base-100 border-2 border-base-300 dropdown-content menu-dropdown-toggle drop-shadow-sm w-full menu absolute rounded-box translate-y-1 !z-[1000] ${predictions.length && showPredictions ? 'visble' : 'invisible'}`}
                    >
                        {predictions.map((p, i) => (
                            <li
                                key={p.place_id}
                                className="hover:bg-base-300 p-1 py-2 mx-1 cursor-pointer transition-colors ease-in-out duration-75 rounded-md"
                                onClick={() => handleGoogleSel(p)}
                                tabIndex={i}
                            >
                                {p.structured_formatting.main_text}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Start section */}
                <div className="text-center lg:text-left w-full max-w-72 motion-preset-slide-up delay-200">
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
                                className="input w-full text-center lg:text-left"
                                value={values['start_date']}
                                onChange={updateValues}
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <label 
                            htmlFor="start_date"
                            className="font-bold text-center lg:text-left"
                        >
                            
                        </label>
                        <div className="flex gap-2 w-full">
                            <select 
                                name="start_time" 
                                id="start_time"
                                className="select w-full p-1 rounded-md border border-gray-600"
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
                {/* End section */}
                <div className="text-center lg:text-left w-full max-w-72 motion-preset-slide-up delay-500">
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
                                className="input w-full text-center lg:text-left"
                                value={values['end_date']}
                                onChange={updateValues}
                            />
                        </div>
                    </div>
                    <div>
                        <select 
                            name="end_time" 
                            id="end_time"
                            className="select w-full p-1 rounded-md border border-gray-600"
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
                    className="btn btn-secondary btn-outline btn-lg w-full lg:w-auto lg:min-w-fit cursor-pointer hover:bg-white border-2 border-orange-500 transition-all ease rounded-md motion-preset-shrink"
                    value="Rent Now"
                />
            </form>
        </section>
    )
}

export default BookNow