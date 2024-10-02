"use client"

import FormModal from "./formModal"
import { reqAddressEmpty, ReqAddressI, ReqAddressSchema } from '../../interface/api/address';
import { useEffect, useState } from "react";
import useBasicFormHook from "@/hooks/useForm";
import Input2 from "../assets/formInput2";

const SetAddressModal = ({
    title,
    callback
}: {
    title: string
    callback: (req: ReqAddressI) => Promise<boolean> | boolean
}) => {
    const {
        updateParams,
        updateValues,
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

    return (
        <FormModal 
            title={title}
            onOk={() => handleCallback()}
            paramKey="set_address"
            loading={false}         
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 px-4 pb-4 overflow-x-hidden">
                <Input2 
                    name="Street Line 1"
                    id="street1"
                    placeHolder=""
                    updateValue={updateValues}
                    value={values.street1}
                    error={errs.street1}
                    
                />
                <Input2 
                    name="Street Line 2"
                    id="street2"
                    placeHolder=""
                    updateValue={updateValues}
                    value={values.street2 || ""}
                    error={errs.street2}
                />
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