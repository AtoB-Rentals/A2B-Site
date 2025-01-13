'use client'
import { CarI, carTypeList, CarTypeT } from '@/interface/api/car';
import { Suspense, useEffect, useRef, useState } from 'react'
import { inThirty, timeFormFormat, toAmPm } from '../../constants/formatting/time';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { DateTime } from 'luxon';
import useBasicFormHook from '@/hooks/useForm';
import { gAddress, parseGeocodeResult } from '@/constants/location/googleRequest';
import usePlaceautoComplete from '@/hooks/usePlaceAutocomplete';
import { AddressType, addressTypes } from '@/interface/api/address';

export const FilterShema = z.object({
    address: z.string().optional(),
    "start_date": z.string().refine(value => {
        return DateTime.fromFormat("yyyy-MM-dd", value).isValid
    }).optional(),
    "end_date": z.string().refine(value => {
        return DateTime.fromFormat("yyyy-MM-dd", value).isValid
    }).optional(),
    "start_time": z.string().refine(value => {
        return DateTime.fromFormat("T", value).isValid
    }).optional(),
    "end_time": z.string().refine(value => {
        return DateTime.fromFormat("T", value).isValid
    }).optional(),
    type: z.string().refine(value => {
        return carTypeList.includes(value as CarTypeT)
    }).optional(),
    addressType: z.string().refine(value => {
        return addressTypes.includes(value as AddressType)
    }).default("Default")
})

const Filter = ({
    initialLocStr,
    defaultLocation
}: {
    initialLocStr: string
    defaultLocation?: {
        state: string
        city: string
        country: string
        lat: number
        long: number
    }
}) => {
    const [ enableFilterBtn, setEnableFilterBtn ] = useState<boolean>(false)
    const [brokeInitInput, setBrokeInitInput] = useState<boolean>(false)

    const {
        input,
        setInput,
        handleGoogleSel,
        selAddress,
        setSelAddress,
        predictions,
        setPredictions,
    } = usePlaceautoComplete({})

    const q = useSearchParams()

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

    const {
        updateValues,
        setValues,
        values,
    } = useBasicFormHook(FilterShema, {
        address: q.get("address") || "",
        "start_date": q.get("start_date") || "",
        "end_date": q.get("end_date") || "",
        "start_time": q.get("start_time") || "",
        "end_time": q.get("end_time") || "",
        type: q.get("type") || "",
        addressType: q.get("addressType") || "Default"
    }, undefined, "filter")

    const init = async () => {
        //** address section **//
        const d: {[key: string]: any} = {}
        const params = new URLSearchParams(q.toString())

        d.address = q.get("address") || initialLocStr

        if (!d.address) {
            console.error("Bad params provided")
        }
        
        let resAddress = await gAddress(d.address)
        if (resAddress === null && initialLocStr) {
            resAddress = await gAddress(initialLocStr)
        }

        if (resAddress === null) {
            alert("unable to find a location")
            d.Address = ""
        } else {
            d.address = resAddress.results[0].formatted_address
            const pGeoRes = parseGeocodeResult(resAddress.results[0])

            if (pGeoRes !== null) {
                Object.keys(pGeoRes).forEach(key => {
                    //@ts-ignore
                    let value = pGeoRes[key]
                    if (typeof value === 'object') {
                        value = JSON.stringify(value)
                    } else if (typeof value === 'number') {
                        value = value.toString()
                    }

                    if (key === 'type') {
                        key = 'addressType'
                    }

                    params.set(key, value)
                })

                setSelAddress(pGeoRes)
            }
        }

        //** Schedule Section */
        const dateFmt = "yyyy-MM-dd"
        /**Start time */
        const qStartTime = q.get("start_time")
        let sTime = DateTime.fromISO(qStartTime || "")
        if (!sTime.isValid) {
            sTime = DateTime.fromFormat("9:00 AM", "t").plus({days: 1}).toUTC()
        }
        d.start_date = sTime.toFormat(dateFmt)
        d.start_time = sTime.toFormat("t")
        
        /**End time */
        const qEndTime = q.get("end_time")
        let eTime = DateTime.fromISO(qEndTime || "")
        if (!eTime.isValid) {
            eTime = DateTime.fromFormat("9:00 AM", "t").plus({days: 3}).toUTC()
        }
        d.end_date = eTime.toFormat(dateFmt)
        d.end_time = eTime.toFormat("t")

        params.set("address", d.address)
        params.set("start_time", sTime.toISO() || "")
        params.set("end_time", eTime.toISO() || "")

        sTime.setZone(tz)
        eTime.setZone(tz)

        await setValues(prev => ({
            ...prev,
            ...d,
            start_date: sTime.setZone(tz).toFormat(dateFmt),
            end_date: eTime.setZone(tz).toFormat(dateFmt),
            start_time: eTime.setZone(tz).toFormat("t"),
            end_time: eTime.setZone(tz).toFormat("t")
        }))

        await setInput(d.address)

        window.history.replaceState({}, '', `?${params.toString()}`)
    }

    const applyFilter = async () => {
        if (!selAddress) {
            alert("Must provide address")
            return
        }

        const params = new URLSearchParams(`${q.toString()}`)

        Object.keys(selAddress).forEach(key => {
            //@ts-ignore
            let value = selAddress[key]
            if (typeof value === 'object') {
                value = JSON.stringify(value)
            } else if (typeof value === 'number') {
                value = value.toString()
            }

            if (key === "type") {
                key = "addressType"
            }

            params.set(key, value)
        })

        const sTime = DateTime.fromFormat(`${values.start_date} ${values.start_time}`, timeFormFormat)
        const eTime = DateTime.fromFormat(`${values.end_date} ${values.end_time}`, timeFormFormat)

        if (!sTime.isValid || !eTime.isValid) {
            alert("something went wrong")
            return
        }

        params.set("start_time", sTime.toUTC().toISO())
        params.set("end_time", eTime.toUTC().toISO())

        window.history.replaceState({}, '', `?${params.toString()}`)
        setEnableFilterBtn(false)
    }

    useEffect(() => {
        init()

        setPredictions([])
        setBrokeInitInput(false)
        setEnableFilterBtn(false)
    }, [])

    useEffect(() => {
        setValues(prev => ({
            ...prev, 
            addressType: selAddress?.type,
            address: input,
        }))
    }, [selAddress])

    useEffect(() => {
        if (!enableFilterBtn) {
            setEnableFilterBtn(true)
        }

        // setBrokeInitInput(true)
    }, [values, selAddress, input])

    return (
        <Suspense>
            <div
                id="filter"
                className="w-full flex flex-col gap-3 p-3 rounded-md text-lg max-w-lg shadow-xl motion-preset-slide-down delay-200 z-20"
            >
                <div
                    className='relative'
                >
                    <input
                        type="text"
                        className="input border rounded-md border-gray-600 p-1 w-full"
                        defaultValue={values.address}
                        placeholder='Where do you want the vehicle?'
                        value={input}
                        onFocus={e => e.target.select()}
                        tabIndex={0}
                        onChange={e => {
                            e.preventDefault()
                            setBrokeInitInput(true)
                            //@ts-ignore
                            setInput(e.target.value)
                        }}
                    />
                    <ul className={`dropdown-content bg-base-100 menu-dropdown-toggle drop-shadow-sm w-full menu absolute rounded-box translate-y-1 ${brokeInitInput && predictions.length ? 'visble' : 'invisible'} border-2 border-base-200`}>
                        {predictions.map((p,i) => (
                            <li
                                key={p.place_id}
                                className='hover:bg-base-300 p-1 py-2 cursor-pointer  hover:shadow-md rounded-md'
                                onClick={() => handleGoogleSel(p)}
                                tabIndex={i}
                            >
                                {`${p.structured_formatting.main_text} - ${p.structured_formatting.secondary_text}`}
                            </li>
                        ))}
                    </ul>
                </div>
                <div
                    className="flex justify-between gap-2"
                >   
                    <div className='flex flex-col gap-3 w-full'>
                        <input 
                            type="date" 
                            name="start_date" 
                            id="start_date"
                            className="input input-bordered w-full p-1 rounded-md border border-gray-600"
                            onChange={updateValues}
                            value={values.start_date}
                        />
                        <select 
                            name="startTime" 
                            id="startTime"
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
                    <div className='flex flex-col gap-3 w-full'>
                        <input 
                            type="date" 
                            name="end_date" 
                            id="end_date" 
                            className="input w-full p-1 rounded-md border border-gray-600"
                            onChange={updateValues}
                            value={values.end_date}
                        />
                        <select 
                            name="end_time" 
                            id="end_time"
                            className="select w-full p-1 rounded-md border border-gray-600"
                            onChange={updateValues}
                            value={values.end_time}
                        >
                            {inThirty.map(t => (
                                <option key={t} onClick={() => setValues(prev => ({...prev, end_time: t}))}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <button
                        className={`text-white font-bold text-lg  w-full p-2 rounded-full ${enableFilterBtn ? "bg-blue-700" : "border-2 border-blue-700 !text-blue-700"} transition-all ease duration-300`}
                        onClick={() => enableFilterBtn && applyFilter()}
                        disabled={!enableFilterBtn}
                    >
                        Apply Filter
                    </button>
                </div>
            </div>
        </Suspense>
    )
}

export default Filter
