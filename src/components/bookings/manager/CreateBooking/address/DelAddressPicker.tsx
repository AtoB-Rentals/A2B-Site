import Loading from "@/components/assets/loading";
import useModal from "@/hooks/ModalHook";
import { CarI } from "@/interface/api/car";


const DelAddressPickerModal = ({
    delAddresses,
    updateAddress
}: {
    delAddresses: CarI['deliveryAddresses']
    updateAddress: (address: CarI['deliveryAddresses'][0]) => void
}) => {
    const { 
            dialogParam,
            dialogRef,
            closeDialog,
            clickOk,
            loading
        } = useModal({
            paramKey: 'pick_address',
            onOk: async () => {
                // Perform your action here
                return true // or false based on your logic
            }
        })

    const updateAddressHandler = (address: CarI['deliveryAddresses'][0]) => {
        updateAddress(address)
        closeDialog()
    }

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

    return (
        <dialog ref={dialogRef} className="modal bg-base-300 fade" id="cancelModal" aria-labelledby="cancelModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <h1 className="text-2xl text-center font-bold text-blue-600">
                            Select Delivery Address
                        </h1>
                        <div className="flex flex-col gap-2 mt-4">
                            {delAddresses.map((address, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => updateAddressHandler(address)} 
                                    className="btn btn-primary w-full h-16 text-lg flex items-center justify-center rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                                >
                                    {address.formatted}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default DelAddressPickerModal