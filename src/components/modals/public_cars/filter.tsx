'use client'
import { getCars } from '@/constants/requests/cars';
import { QueryParams } from '@/constants/requests/constants';
import { CarI, carTypeList, CarTypeT } from '@/interface/api/car';
import { useEffect, useRef, useState } from 'react'
import AutoComplete from 'react-google-autocomplete'
import { inThirty, toAmPm } from '../../../constants/formatting/time';
import { useSearchParams } from 'next/navigation';
import { object, z } from 'zod';
import { DateTime } from 'luxon';
import useBasicFormHook from '@/hooks/useForm';
import { gAddress, GeocodeResultI, parseGeocodeResult } from '@/constants/location/googleRequest';

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
    }).optional()
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
    const [ searchAiport, setSearchAirport ] = useState<boolean>(false)
    const [ selAddress, setSelAddress ] = useState<GeocodeResultI>()
    const autoCompleteRef = useRef<any>(null)

    const q = useSearchParams()

    const {
        updateParams,
        updateValues,
        setValues,
        values,
        errs
    } = useBasicFormHook(FilterShema, {
        address: q.get("address") || "",
        "start_date": q.get("start_date") || "",
        "end_date": q.get("end_date") || "",
        "start_time": q.get("start_time") || "",
        "end_time": q.get("end_time") || "",
        type: q.get("type") || ""
    }, undefined, "filter")

    const init = async () => {
        //** address section **//
        const d: {[key: string]: any} = {}
        const params = new URLSearchParams(q.toString())

        d.address = q.get("address") || initialLocStr
        const airport = q.get('airport')
        if (airport) {
            d.address = airport + " airport"
            await setSearchAirport(true)
        }

        if (!d.address) {
            alert("Bad params provided")
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

                    params.set(key, value)
                })

                setSelAddress(pGeoRes)
            }
        }

        //** Schedule Section **/
        const dateFmt = "yyyy-MM-dd"
        const qStartDate = q.get("start_date")
        /**Start time */
        let sDate = DateTime.fromFormat(qStartDate || "", dateFmt)
        if (!sDate.isValid) {
            sDate = DateTime.now().plus({ days: 4 })
        }
        d.start_date = sDate.toFormat(dateFmt)

        const qEndDate = q.get("end_date")
        let eDate = DateTime.fromFormat(qEndDate || "", dateFmt)
        if (!eDate.isValid) {
            eDate = sDate.plus({ days: 3 })
        }
        d.end_date = eDate.toFormat(dateFmt)

        const qStartTime = q.get("start_time")
        let sTime = DateTime.fromFormat(qStartTime || "", "t")
        if (!sTime.isValid) {
            sTime = DateTime.fromFormat("9:00 AM", "t")
        }
        d.start_time = sTime.toFormat("t")
        
        const qEndTime = q.get("end_time")
        let eTime = DateTime.fromFormat(qEndTime || "", "t")
        if (!eTime.isValid) {
            eTime = DateTime.fromFormat("9:00 AM", "t")
        }
        d.end_time = eTime.toFormat("t")

        console.log("qStartTime", qStartTime)
        console.log("d.start_time: ", d.start_time)

        params.set("address", d.address)
        params.set("start_date", d.start_date)
        params.set("end_date", d.end_date)
        params.set("start_time", d.start_time)
        params.set("end_time", d.end_time)

        await setValues(prev => ({
            ...prev,
            ...d
        }))

        window.history.replaceState({}, '', `?${params.toString()}`)
    }

    const applyFilter = async () => {
        if (!selAddress) {
            alert("Must provide address")
            return
        }

        const params = new URLSearchParams(`${q.toString()}}`)

        Object.keys(selAddress).forEach(key => {
            //@ts-ignore
            let value = selAddress[key]
            if (typeof value === 'object') {
                value = JSON.stringify(value)
            } else if (typeof value === 'number') {
                value = value.toString()
            }

            params.set(key, value)
        })

        Object.keys(values).forEach(key => {
            //@ts-ignore
            let value = values[key]
            if (typeof value === 'object') {
                value = JSON.stringify(value)
            } else if (typeof value === 'number') {
                value = value.toString()
            }

            console.log("value: ", key, value)

            params.set(key, value)
        })

        window.history.replaceState({}, '', `?${params.toString()}`)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div
            id="filter"
            className="w-full flex flex-col gap-3 p-3 rounded-md text-lg shadow-gray-200 shadow-[0px_0px_10px_10px]"
        >
            <div>

                {!searchAiport && <AutoComplete
                    ref={autoCompleteRef}
                    className="border rounded-md border-gray-600 p-1 w-full"
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
                    defaultValue={values.address}
                    onFocus={e => e.target.select()}
                    onChange={e => {
                        e.preventDefault()
                        //@ts-ignore
                        setValues(prev => ({...prev, address: e.target.value}))
                    }}
                    options={{
                        types: ["(regions)"]
                    }}
                    onPlaceSelected={(data) => {
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
                {searchAiport && <AutoComplete 
                    className="border rounded-md border-gray-600 p-1 w-full"
                    placeholder="Airports"
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
                    onChange={e => {
                        e.preventDefault()
                        //@ts-ignore
                        setValues(prev => ({...prev, address: e.target.value}))
                    }}
                    options={{
                        types: ["airport"]
                    }}
                    value={values.address}
                    onPlaceSelected={(data) => {
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
                <input 
                    type="checkbox" 
                    name="searchAirport" 
                    id="searchAirport"
                    // defaultChecked={searchAiport}
                    checked={searchAiport}
                    onChange={() => setSearchAirport(!searchAiport)}
                />
                <label 
                    htmlFor="searchAirport"
                    className='ml-2'
                >
                    Airport Search
                </label>
            </div>
            <div
                className="flex justify-between gap-2"
            >   
                <div className='flex flex-col gap-3 w-full'>
                    <input 
                        type="date" 
                        name="start_date" 
                        id="start_date"
                        className="w-full p-1 rounded-md border border-gray-600"
                        onChange={updateValues}
                        value={values.start_date}
                    />
                    <select 
                        name="startTime" 
                        id="startTime"
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
                <div className='flex flex-col gap-3 w-full'>
                    <input 
                        type="date" 
                        name="end_date" 
                        id="end_date" 
                        className="w-full p-1 rounded-md border border-gray-600"
                        onChange={updateValues}
                        value={values.end_date}
                    />
                    <select 
                        name="end_time" 
                        id="end_time"
                        className="w-full p-1 rounded-md border border-gray-600"
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
                    className='text-white font-bold text-lg bg-blue-700 w-full p-2 rounded-full'
                    onClick={() => applyFilter()}
                >
                    Apply Filter
                </button>
            </div>
        </div>
    )
}

export default Filter
