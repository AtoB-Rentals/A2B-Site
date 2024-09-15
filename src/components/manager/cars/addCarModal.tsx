import Input2 from "@/components/assets/formInput2"
import FormModal from "@/components/modals/formModal"
import { addCar } from "@/constants/requests/cars";
import useBasicFormHook from "@/hooks/useForm";
import { AddCarI, AddCarSchema, carTypeList, CarTypeT } from "@/interface/api/car";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AddCarModal = ({
    onSuccess
}: {
    onSuccess: () => void
}) => {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    const {
        updateParams,
        updateValues,
        values,
        errs
    } = useBasicFormHook(AddCarSchema, {
        make: "",
        year: "",
        model: "",
        type: ""
    }, undefined, "add_Car")

    const handleAddCar = async (): Promise<boolean> => {
        setLoading(true)
        const res = await addCar(values as AddCarI)

        if(res.isErr) {
            if (res.status === 401 || res.status === 403) {
                Cookies.remove("token")
                router.push('/manager/login')
            }
            
            if (res.status === 400) {
                alert('Invalid data provided')
                throw 'Something went wrong'
            }

            if (res.status === 500) {
                alert('something wrong please try again later')
            }
            setLoading(false)
            
            return false
        }
        
        
        setLoading(false)
        onSuccess()
        return true
    }

    useEffect(() => {
        updateParams()
    }, [values])

    return (
        <FormModal
            title="Add Car"
            paramKey="addCarModal"
            onOk={handleAddCar}
            loading={loading}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 px-4 pb-4 overflow-x-hidden">
                <Input2 
                    name="Make"
                    id="make"
                    placeHolder="Chevy"
                    updateValue={updateValues}
                    value={values.make}
                    error={errs.make}
                />
                <Input2 
                    name="Model"
                    id="model"
                    placeHolder="Cruze"
                    updateValue={updateValues}
                    value={values.model}
                    error={errs.model}
                />
                <Input2 
                    name="Year"
                    id="year"
                    placeHolder="2020"
                    updateValue={updateValues}
                    value={values.year}
                    error={errs.make}
                />
                <div
                    className={`flex flex-col text-left px-1`}
                >
                    <label htmlFor='type' className='mb-1 text-lg'>
                        Vehicle Type
                    </label>
                    <select 
                        id='type'
                        className='border-2 border-lime-500 text-lg rounded-lg py-0.5'
                        value={values.type}
                        onChange={e => updateValues(e)}
                        
                    >
                        {
                            carTypeList.map(type => (
                                <option key={type}>
                                    {type}
                                </option>
                            ))
                        }
                    </select>
                    <p className='font-bold text-red-500'>{errs.chargeType}</p>
                </div>
            </div>
        </FormModal>
    )
}

export default AddCarModal