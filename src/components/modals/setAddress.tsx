"use client"

import FormModal from "./formModal"
import { reqAddressEmpty, ReqAddressI, ReqAddressSchema } from '../../interface/api/address';
import { useEffect, useRef, useState } from "react";
import useBasicFormHook from "@/hooks/useForm";
import Input2 from "../assets/formInput2";
import { GeocodeResultI, gPlaceId, parseGeocodeResult } from "@/constants/location/googleRequest"
import AutoComplete from 'react-google-autocomplete'
import { extractFirstParenthesesValue } from "@/constants/requests/constants";
import { autoComplete } from "@/constants/google/places";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import usePlaceautoComplete from "@/hooks/usePlaceAutocomplete";


type searchTypeT = 
    | "Airport"
    | "Region"
    | "Address"
    | "Default"

const searchTypeMap = {
    "Region": "(region)",
    "Address": "address",
    "Airport": "airport",
    "Default": "geocode"
} as const

const SetAddressModal = ({
    title,
    callback,
    searchTypes = ["Default"],
    paramKey
}: {
    title: string
    callback: (req: ReqAddressI) => Promise<boolean> | boolean
    searchTypes?: searchTypeT[]
    paramKey: string
}) => {
    const [ currentSearchType, setCurrentSearchType ] = useState<searchTypeT>(searchTypes[0] || "Default")
    const {
        updateValues,
        setValues,
        values,
        errs,
        clearValues
    } = useBasicFormHook(ReqAddressSchema, reqAddressEmpty, undefined, "set_address_form")

    const autoCompleteInputRef = useRef(null)

    const handleCallback = async (): Promise<boolean> => {
        if (Object.keys(errs).length !== 0) {
            return false
        }
        const res = await callback(values as ReqAddressI)
        
        res && clearValues()

        return res
    }

    const {
        input,
        setInput,
        handleGoogleSel,
        selAddress,
        predictions
    } = usePlaceautoComplete({})

    useEffect(() => {
        setValues(prev => ({
            ...prev,
            state: selAddress?.region || "",
            country: selAddress?.country || "",
            city: selAddress?.city || "",
            zipcode: selAddress?.zipcode || "",
            index: selAddress?.index || "",
            type: selAddress?.type || "Default",
            street1: selAddress?.address || ""
        }))
    }, [selAddress])

    return (
        <FormModal 
            title={title}
            onOk={() => handleCallback()}
            paramKey={paramKey}
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

                <div className="col-start-1 col-span-2 relative">
                    <label htmlFor="street1" className='mb-1 text-lg'>
                        Address Line 1
                    </label>
                    <input
                        className="border-2 rounded-md dark:border-lime-500 p-1 w-full col-start-1 col-span-2"
                        value={input}
                        onFocus={e => e.target.select()}
                        ref={autoCompleteInputRef}
                        onChange={e => {
                            e.preventDefault()
                            setInput(e.target.value)
                        }}
                    />
                    <div 
                        className="flex flex-col absolute bg-white border border-black w-full rounded-md"
                    >
                        {autoCompleteInputRef.current === document.activeElement && predictions.map(p => (
                            <div 
                                className="w-full hover:bg-gray-300 px-2 cursor-default"
                                key={p.place_id}
                                onClick={e => {
                                    e.preventDefault()
                                    handleGoogleSel(p)
                                }}
                            >
                                {p.structured_formatting.main_text}
                            </div>
                        ))}
                    </div>
                </div>
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