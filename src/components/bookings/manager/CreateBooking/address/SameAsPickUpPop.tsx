'use client'

import useModal from "@/hooks/ModalHook"
import { AddressI } from "@/interface/api/address"

const SameAsPickUpPop = ({
    pickUpAddress,
    updateDropOff
}: {
    pickUpAddress: AddressI,
    updateDropOff: () => void
}) => {
    const { 
        dialogParam,
        dialogRef,
        closeDialog,
        clickOk
    } = useModal({
        paramKey: 'same_as_pickup',
        onOk: async () => {
            updateDropOff()
            // closeDialog()
            return true // or false based on your logic
        }
    })

    const dialog: JSX.Element  = (
        <dialog ref={dialogRef} className="modal bg-base-300 fade" id="cancelModal" aria-labelledby="cancelModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="cancelModalLabel">Same as dropoff</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <p>Is the drop location the same as the pick up location?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-error mr-4" data-bs-dismiss="modal" onClick={closeDialog}>No</button>
                        <button type="button" className="btn btn-success" onClick={() => clickOk()}>Yes</button>
                    </div>
                </div>
            </div>
        </dialog>
    )

    return dialogParam === 'y' ? dialog : null
}

export default SameAsPickUpPop