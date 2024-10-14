"use client"

import FormModal from "./formModal"
import { reqAddressEmpty, ReqAddressI, ReqAddressSchema } from '../../interface/api/address';
import { useEffect, useState } from "react";
import useBasicFormHook from "@/hooks/useForm";
import Input2 from "../assets/formInput2";
import { GeocodeResultI, parseGeocodeResult } from "@/constants/location/googleRequest"
import AutoComplete from 'react-google-autocomplete'


type searchTypeT = 
    | "Airport"
    | "Region"
    | "Address"

const searchTypeMap = {
    "Region": "(region)",
    "Address": "address",
    "Airport": "airport"
} as const

const SetAddressModal = ({
    title,
    callback,
    searchTypes = ["Address"]
}: {
    title: string
    callback: (req: ReqAddressI) => Promise<boolean> | boolean
    searchTypes?: searchTypeT[]
}) => {
    const [ selAddress, setSelAddress ] = useState<GeocodeResultI>()
    const [ currentSearchType, setCurrentSearchType ] = useState<searchTypeT>(searchTypes[0])
    const {
        updateParams,
        updateValues,
        setValues,
        values,
        errs,
        clearValues
    } = useBasicFormHook(ReqAddressSchema, reqAddressEmpty, undefined, "set_address_form")

    // useEffect(() => {
    //     updateParams()
    // }, [values])

    const handleCallback = async (): Promise<boolean> => {
        if (Object.keys(errs).length !== 0) {
            return false
        }
        const res = await callback(values as ReqAddressI)
        
        res && clearValues()

        return res
    }

    const handleGoogleSel = (data: google.maps.places.PlaceResult) => {
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
    }

    useEffect(() => {
        
        setValues(prev => ({
            ...prev,
            state: selAddress?.region || "",
            country: selAddress?.country || "",
            city: selAddress?.city || "",
            zipcode: selAddress?.zipcode || ""
        }))
    }, [selAddress])

    return (
        <FormModal 
            title={title}
            onOk={() => handleCallback()}
            paramKey="set_delivery_address"
            loading={false}         
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 px-4 pb-4 p-2">
                <select 
                    name="searchType" 
                    id="searchType" 
                    disabled={searchTypes.length === 1}
                    value={currentSearchType}
                    onChange={e => setCurrentSearchType(e.target.value as searchTypeT)}
                    className='col-start-1 col-end-3 col-span-2 text-lg bg-slate-300 rounded-md pt-2 pb-2'
                >
                    {searchTypes.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                {currentSearchType === 'Region' && <div className="col-start-1 col-span-2">
                    <label htmlFor="street1" className='mb-1 text-lg'>
                        Address Line 1
                    </label>
                    <AutoComplete
                        className="border-2 rounded-md dark:border-lime-500 p-1 w-full col-start-1 col-span-2"
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
                        defaultValue={values.street1}
                        onFocus={e => e.target.select()}
                        onChange={e => {
                            e.preventDefault()
                            //@ts-ignore
                            setValues(prev => ({...prev, address: e.target.value}))
                        }}
                        options={{
                            types: ["(region)"]
                        }}
                        onPlaceSelected={data => {
                            handleGoogleSel(data)
                        }}
                    />
                </div>}
                {currentSearchType === 'Address' && <div className="col-start-1 col-span-2">
                    <label htmlFor="street1" className='mb-1 text-lg'>
                        Address Line 1
                    </label>
                    <AutoComplete
                        className="border-2 rounded-md dark:border-lime-500 p-1 w-full overflow-visible z-[999999]"
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
                        defaultValue={values.street1}
                        onFocus={e => e.target.select()}
                        onChange={e => {
                            e.preventDefault()
                            //@ts-ignore
                            setValues(prev => ({...prev, address: e.target.value}))
                        }}
                        options={{
                            types: ["address"]
                        }}
                        onPlaceSelected={data => {
                            handleGoogleSel(data)
                        }}
                    />
                </div>}
                {currentSearchType === 'Airport' && <div className="col-start-1 col-span-2">
                    <label htmlFor="street1" className='mb-1 text-lg'>
                        Address Line 1
                    </label>
                    <AutoComplete
                        className="border-2 rounded-md dark:border-lime-500 p-1 w-full col-start-1 col-span-2"
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
                        defaultValue={values.street1}
                        onFocus={e => e.target.select()}
                        onChange={e => {
                            e.preventDefault()
                            //@ts-ignore
                            setValues(prev => ({...prev, address: e.target.value}))
                        }}
                        options={{
                            types: ["airport"]
                        }}
                        onPlaceSelected={data => {
                            handleGoogleSel(data)
                        }}
                    />
                </div>}
                {currentSearchType === 'Address' && <Input2 
                    name="Street Line 2"
                    id="street2"
                    placeHolder=""
                    updateValue={updateValues}
                    value={values.street2 || ""}
                    error={errs.street2}
                />}
                <Input2 
                    name="City"
                    id="city"
                    placeHolder=""
                    updateValue={updateValues}
                    value={values.city}
                    error={errs.city}
                />
                <Input2 
                    name="State"
                    id="state"
                    placeHolder=""
                    updateValue={updateValues}
                    value={values.state}
                    error={errs.state}
                />
                <Input2 
                    name="Country"
                    id="country"
                    placeHolder=""
                    updateValue={updateValues}
                    value={values.country}
                    error={errs.country}
                />
                <Input2 
                    name="Zipcode"
                    id="zipcode"
                    placeHolder=""
                    updateValue={updateValues}
                    value={values.zipcode}
                    error={errs.zipcode}
                />
            </div>
        </FormModal>
    )
}

export default SetAddressModal