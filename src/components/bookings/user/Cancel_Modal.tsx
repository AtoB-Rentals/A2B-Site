'use client'

import Loading from "@/components/assets/loading"
import useModal from "@/hooks/ModalHook"

const CancelModal = ({
    bookingId,
    onOk
}: {
    bookingId: string
    onOk: () => Promise<boolean | void>
}) => {
    const { 
        dialogParam,
        dialogRef,
        closeDialog,
        clickOk,
        loading
    } = useModal({
        paramKey: 'show_cancel',
        onOk: onOk
    })

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
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="cancelModalLabel">Cancel Booking</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to cancel this booking?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeDialog}>Close</button>
                        <button type="button" className="btn btn-danger" onClick={() => clickOk()}>Cancel Booking</button>
                    </div>
                </div>
            </div>
        </dialog>
    )

    return dialogParam === 'y' ? dialog : null
}

export default CancelModal