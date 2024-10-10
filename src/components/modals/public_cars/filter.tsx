'use client'
import { getCars } from '@/constants/requests/cars';
import { QueryParams } from '@/constants/requests/constants';
import { CarI, carTypeList, CarTypeT } from '@/interface/api/car';
import { useEffect, useRef, useState } from 'react'
import AutoComplete from 'react-google-autocomplete'
import { inThirty } from '../../../constants/formatting/time';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { DateTime } from 'luxon';
import useBasicFormHook from '@/hooks/useForm';

export const FilterShema = z.object({
    address: z.string().optional(),
    "start_date": z.string().refine(value => {
        return DateTime.fromFormat("YYYY-MM-dd", value).isValid
    }).optional(),
    "end_date": z.string().refine(value => {
        return DateTime.fromFormat("YYYY-MM-dd", value).isValid
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

interface ParsedLocation {
  type: 'state' | 'city' | 'country' | 'zipcode' | 'airport';
  value: string;
}

const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

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

    const init = async () => {
        const d: {[key: string]: any} = {}

        d.address = q.get("address") || initialLocStr
        if (!d.address) {
            alert("Bad params provided")
        }

        setValues(prev => ({
            ...prev,
            ...d
        }))
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        updateParams()
    }, [values])

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
                    onPlaceSelected={(data) => {console.log('place data: ', data)}}
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
                        name="startDate" 
                        id="startDate"
                        className="w-full p-1 rounded-md border border-gray-600"
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
                        name="endTime" 
                        id="endTime" 
                        className="w-full p-1 rounded-md border border-gray-600"
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
        </div>
    )
}

export default Filter