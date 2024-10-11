'use client'
import { getCars } from '@/constants/requests/cars';
import { QueryParams } from '@/constants/requests/constants';
import { CarI, carTypeList, CarTypeT } from '@/interface/api/car';
import { useEffect, useRef, useState } from 'react'
import AutoComplete from 'react-google-autocomplete'
import { inThirty } from '../../../constants/formatting/time';
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
    const [searchAiport, setSearchAirport] = useState<boolean>(false)
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
        address: q.get("address") || undefined,
        "start_date": q.get("start_date") || undefined,
        "end_date": q.get("end_date") || undefined,
        "start_time": q.get("start_time") || undefined,
        "end_time": q.get("end_time") || undefined,
        type: q.get("type") || undefined
    }, undefined, "filter")

    const initAddress = async () => {
        const d: {[key: string]: any} = {}

        d.address = q.get("address") || initialLocStr
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
                const params = new URLSearchParams(q.toString())
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
                window.history.replaceState({}, '', `?${params.toString()}`)
                
                setSelAddress(pGeoRes)
            }
        }


        setValues(prev => ({
            ...prev,
            ...d
        }))
    }

    const initSchedule = () => {
        const qStartDate = q.get("start_date")
        /**Start time */
        let sDate = DateTime.fromFormat("yyyy-MM-dd", qStartDate || "")
        if (!sDate.isValid) {
            sDate = DateTime.now().plus({ days: 4 })
        }

        const qEndDate = q.get("end_date")
        let eDate = DateTime.fromFormat("yyyy-MM-dd", qEndDate || "")
        if (!eDate.isValid) {
            eDate = sDate.plus({ days: 3 })
        }

        setValues(prev => ({
            ...prev,
            "start_date": sDate.toFormat("yyyy-MM-dd"),
            "end_date": eDate.toFormat("yyyy-MM-dd")
        }))

        console.log("values3: ", values)

        const params = new URLSearchParams(q.toString())
        params.set("start_date", sDate.toFormat("yyyy-MM-dd"))
        params.set("end_date", eDate.toFormat("yyyy-MM-dd"))

        console.log("log: ", params.toString())

        window.history.replaceState({}, '', `?${params.toString()}`)
    }

    const applyFilter = () => {
        if (!selAddress) {
            alert("Must provide address")
            return
        }

        updateParams()

        const params = new URLSearchParams(q.toString())

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

        // window.history.replaceState({}, '', `?${params.toString()}`)
    }

    useEffect(() => {
        (async () => {
            await initAddress()
            await initSchedule()
            console.log('values2: ', values)
        })()
        .finally(() => {
            updateParams()
        })
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
                    options={{
                        types: ["airport"]
                    }}
                    onPlaceSelected={(data) => {console.log('place data: ', data)}}
                />}
                <input 
                    type="checkbox" 
                    name="searchAirport" 
                    id="searchAirport"
                    defaultChecked={searchAiport}
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
                        name="startTime" 
                        id="startTime"
                        className="w-full p-1 rounded-md border border-gray-600"
                    >
                        {inThirty.map(t => (
                            <option key={t}>
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
