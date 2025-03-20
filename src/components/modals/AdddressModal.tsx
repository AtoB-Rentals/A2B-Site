import useModal from "@/hooks/ModalHook"
import { useEffect, useState } from "react"
import Loading from "../assets/loading"
import useBasicFormHook from "@/hooks/useForm"
import { AddressI, reqAddressEmpty, ReqAddressSchema } from "@/interface/api/address"
import usePlaceautoComplete from "@/hooks/usePlaceAutocomplete"


const AddressModal = (
    {
        updateAddress
    }: {
        updateAddress: (address: AddressI) => void
    }
) => {
    const { 
        dialogParam,
        dialogRef,
        closeDialog,
        clickOk,
        loading
    } = useModal({
        paramKey: 'set_address',
        onOk: async () => {
            // Perform your action here
            return true // or false based on your logic
        }
    })

    const {
        updateValues,
        setValues,
        values,
        errs,
        clearValues
    } = useBasicFormHook(ReqAddressSchema, reqAddressEmpty, undefined, "")

    const handleSetAddress = () => {
        
        const address: AddressI = {
            street1: selAddress?.address || values.street1,
            street2: values.street2 || "",
            city: selAddress?.city || "",
            zipcode: selAddress?.zipcode || "",
            country: selAddress?.country || "",
            placeId: selAddress?.placeId || "",
            state: selAddress?.region || "",
            formatted: selAddress?.address || "",
            geo: {
                type: "Point",
                coordinates: [
                    selAddress?.longitude || 0,
                    selAddress?.latitude || 0
                ]
            },
            url: "",
            type: "Default"
        }

        updateAddress(address)

        console.log(selAddress)
        console.table(values)

        clearValues()
        closeDialog()
    }

    useEffect(() => {
        if (values['street1'] === "") {
            setValues(() => ({
                ...reqAddressEmpty,
                street1: values.street1
            }))
        }
    } , [dialogParam])

    const {
            input,
            setInput,
            handleGoogleSel,
            selAddress,
            predictions
        } = usePlaceautoComplete({})

    if (loading) {
        return <dialog ref={dialogRef} className="modal bg-base-300 fade" id="cancelModal" aria-labelledby="cancelModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <Loading />
                    </div>
                </div>
            </div>
        </dialog>
    }

    const dialog: JSX.Element  = (
        <dialog ref={dialogRef} className="modal bg-base-300 fade" id="cancelModal" aria-labelledby="cancelModalLabel" aria-hidden="true">
            <div className="modal-dialog w-full md:max-w-[700px] md:mx-auto px-4">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-center text-2xl font-bold" id="cancelModalLabel">Set Address</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>

                    {/* FORM SECTION */}
                    <div className="w-full md:mx-auto">
                        {/* AUTOCOMPLETE */}
                        <div className="form-group mb-3">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="address" className="form-label font-bold">Street Line 1</label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    value={input} 
                                    onChange={(e) => setInput(e.target.value)} 
                                    placeholder="Enter address" 
                                    className="input"
                                    autoComplete="off"

                                />
                            </div>
                            {/* Predictions */}
                            <div 
                                className={`w-full flex flex-col gap-2 mt-2 h-auto overflow-y-auto border-white border-2 rounded-lg ${predictions && predictions.length > 0 ? "flex" : "hidden"}`}
                            >
                                {predictions && predictions.map((prediction, index) => (
                                    <div className="flex flex-col justify-center text-center" key={index}>
                                        <button 
                                            key={index} 
                                            onClick={() => handleGoogleSel(prediction)}
                                            className="hover:bg-slate-200 hover:text-black transition-colors duration-200 ease-in-out p-2 rounded-lg text-left"
                                        >
                                            {prediction.structured_formatting.main_text}, {prediction.structured_formatting.secondary_text}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {errs.address && <span className="text-danger">{errs.address}</span>}

                        {/* STREET LINE 2 */}
                        {selAddress && <div className="form-group mb-3">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="street2" className="form-label font-bold">Street Line 2</label>
                                <input 
                                    type="text" 
                                    id="street2" 
                                    value={values.street2} 
                                    onChange={(e) => updateValues(e)} 
                                    placeholder="Enter address" 
                                    className="input"
                                />
                            </div>
                        </div>}
                        {errs.street2 && <span className="text-danger">{errs.street2}</span>}
                        <div className="md:flex md:gap-4 w-full">
                            {/* CITY */}
                            {selAddress && <div className="form-group mb-3 w-full">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="city" className="form-label font-bold">City</label>
                                    <input 
                                        type="text" 
                                        id="city" 
                                        value={values.city || selAddress?.city} 
                                        onChange={(e) => updateValues(e)} 
                                        placeholder="Enter city" 
                                        className="input"
                                        defaultValue={selAddress?.city || ""}
                                    />
                                </div>
                                {errs.city && <span className="text-danger">{errs.city}</span>}
                            </div>}

                            {/* zipcode */}
                            {selAddress && <div className="form-group mb-3 w-full">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="zipcode" className="form-label font-bold">Zipcode</label>
                                    <input 
                                        type="text" 
                                        id="zipcode" 
                                        value={values.zipcode || selAddress?.zipcode} 
                                        onChange={(e) => updateValues(e)} 
                                        placeholder="Enter zipcode" 
                                        className="input"
                                    />
                                </div>
                                {errs.city && <span className="text-danger">{errs.city}</span>}
                            </div>}
                        </div>
                        {selAddress && <div className="form-group mb-3">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="country" className="form-label font-bold">Country</label>
                                <input 
                                    type="text" 
                                    id="country" 
                                    value={values.country || selAddress?.country} 
                                    onChange={(e) => updateValues(e)} 
                                    placeholder="Enter country" 
                                    className="input"
                                />
                            </div>
                            {errs.city && <span className="text-danger">{errs.city}</span>}
                        </div>}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-error mr-2" data-bs-dismiss="modal" onClick={closeDialog}>Close</button>
                        <button type="button" className="btn btn-success border-2 border-white" onClick={() => handleSetAddress()}>Set Address</button>
                    </div>
                </div>
            </div>
        </dialog>
    )

    return dialogParam === 'y' ? dialog : null
}

export default AddressModal