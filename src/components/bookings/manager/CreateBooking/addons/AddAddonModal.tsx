'use client'

import useModal from "@/hooks/ModalHook"
import useBasicFormHook from "@/hooks/useForm"
import { BookingI } from "@/interface/api/booking"
import { useEffect } from "react"
import { object, z } from "zod"

const addAddonSchema = z.object({
    name: z.string().min(1, "Name is required"),    // Must be a non-empty string
    description: z.string().optional(),
    amount: z.string().refine(num => {
        const parsedNum = parseInt(num),
        isValid = !isNaN(parsedNum) && parsedNum > 0
        return isValid
    }, "Amount is required"),
    type: z.enum([
        "Singular",
        "Quantitative"
    ])
})

const AddAddonModal = ({
    addons,
    addAddon
}: {
    addons: BookingI['addons']
    addAddon: (aO: BookingI['addons'][0]) => void
}) => {
    const { 
        dialogParam,
        dialogRef,
        closeDialog,
        clickOk,
        loading,
    } = useModal({
        paramKey: 'add_addon',
        onOk: async () => {
            addAddon({
                name: values.name,
                description: values.description || "",
                amount: parseInt(values.amount),
                type: values.type,
                quantity: 1,
                total: 0
            })
            return true // or false based on your logic
        }
    })

    const {
        updateValues,
        setValues,
        values,
        errs,
        clearValues,
        validateValues,
        setErrs
    } = useBasicFormHook(addAddonSchema, {
        name: "",
        description: "",
        amount: "1",
        type: "Singular"
    }, undefined, "")

    const handleSubmit = () => {
        if (Object.keys(errs).length > 0) {
            validateValues()
            return
        }

        if (addons.some(addon => addon.name === values.name)) {
            setErrs({ name: "Addon already exists" })
            return
        }

        addAddon({
            name: values.name,
            description: values.description || "",
            amount: parseInt(values.amount),
            type: values.type,
            quantity: 1,
            total: 0
        })
        clearValues()
        closeDialog()
    }

    return (
        <dialog ref={dialogRef} className="modal bg-base-300 fade" id="cancelModal" aria-labelledby="cancelModalLabel" aria-hidden="true">
            <div className="modal-dialog w-full md:max-w-[700px] md:mx-auto px-4">
                <div className="modal-content">
                    <div className="modal-header flex justify-between items-center">
                        <h1 className="text-2xl text-center font-bold text-blue-600">
                            Add Addon
                        </h1>
                        <button 
                            className="btn btn-sm btn-circle btn-ghost text-red-500 font-extrabold text-2xl"
                            onClick={closeDialog}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="modal-body w-full">
                        <form className="flex flex-col gap-2 mt-4 w-full">
                            <div className="md:flex gap-2 w-full justify-between">
                                <div className="form-control w-full">
                                    <label 
                                        htmlFor="name" 
                                        className="label"
                                    >
                                        Name*
                                    </label>
                                    <input
                                        type="text" 
                                        name="name" 
                                        id="name"
                                        className="input input-bordered w-full"
                                        placeholder="Name of the addon"
                                        onChange={updateValues}
                                        value={values.name}
                                    />
                                    <p className="text-error font-bold">{errs["name"]}</p>
                                </div>
                                <div className="form-control w-full">
                                    <label 
                                        htmlFor="amount" 
                                        className="label"
                                    >
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="amount" 
                                        id="amount"
                                        placeholder="1000 = $10.00"
                                        min={0}
                                        onChange={updateValues}
                                        value={values.amount}
                                        className="input input-bordered w-full"
                                    />
                                    <p className="text-error font-bold">{errs["amount"]}</p>
                                </div>
                            </div>
                            <div>
                                <label 
                                    htmlFor="description" 
                                    className="label"
                                >
                                    Description
                                </label>
                                <textarea
                                    name="description" 
                                    id="description"
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Description of the addon"
                                    onChange={updateValues}
                                    value={values.description}
                                ></textarea>
                                <p className="text-error font-bold">{errs["description"]}</p>
                            </div>
                            <div>
                                <label 
                                    htmlFor="type" 
                                    className="label"
                                >
                                    Type
                                </label>
                                <select 
                                    name="type" 
                                    id="type"
                                    className="select select-bordered w-full"
                                    defaultValue={values.type}
                                    onChange={updateValues}
                                    value={values.type}
                                >
                                    <option value="Singular">Singular</option>
                                    <option value="Quantitative">Quantitative</option>
                                </select>
                                <p className="text-error font-bold">{errs["type"]}</p>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer flex  gap-4 items-center mt-4">
                        <button 
                            className="btn btn-error"
                            onClick={closeDialog}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={() => handleSubmit()}
                        >
                            Add Addon
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default AddAddonModal