'use client'

import { FilterShema } from "@/components/modals/public_cars/filter"
import { GeocodeResultI } from "@/constants/location/googleRequest"
import useBasicFormHook from "@/hooks/useForm"
import { ReqAddressSchema } from "@/interface/api/address"
import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import { useState } from "react"

const AddDelAddressModal = ({

}:{

}) => {
    // const [ airportSearch, setAirportSearch ] = useState<boolean>(false)
    // const [ selAddress, setSelAddress ] = useState<GeocodeResultI>()
    // const router = useRouter()

    // const currentDate = DateTime.now()
    // const {
    //     updateValues,
    //     values,
    //     setValues
    // } = useBasicFormHook(ReqAddressSchema, {
    //     'street1': '',
    //     'street2': '',
    //     'city': '',
    //     'state': '',
    //     'country': '',
    // }, undefined, "filter")
    // const [ loading, setLoading ] = useState<boolean>(false)

    // return (
    //     <FormModal
    //         title="Add Delivery Address"
    //         paramKey="add_delivery_address"
    //         onOk={ handleAddPic }
    //         loading={ loading }
    //     >

    //     </FormModal>
    // )

    return <></>
}

export default AddDelAddressModal