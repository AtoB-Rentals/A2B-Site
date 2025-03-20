'use client'
import useModal from '@/hooks/ModalHook';
import { RemBooking } from '../../../../constants/requests/bookings';
import Loading from '@/components/assets/loading';
import { useRouter } from 'next/navigation';

const RemBookingModal = ({
    bookingId,
    isBlocked
}: {
    bookingId: string
    isBlocked?: boolean
    onOk?: () => Promise<boolean | void>
}) => {
    const router = useRouter()

    const handleRemBooking = async (): Promise<boolean> => {
        const res = await RemBooking(bookingId)
        if (res.isErr) {
            if (res.status === 400 || res.status === 404) {
                alert(res.message)
                return true
            }
            return false
        }
        
        // window.history.replaceState({}, '', `?`)
        window.history.go(-2)

        return true
    }

    const { 
        dialogParam,
        dialogRef,
        closeDialog,
        clickOk,
        loading
    } = useModal({
        paramKey: 'remove_booking',
        onOk: handleRemBooking
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
                        <h5 className="modal-title" id="cancelModalLabel">Remove {isBlocked ? "Blockage" : "Booking"}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to cancel this {isBlocked ? "Blockage" : "Booking"}?</p>
                        <p>***This cannot be reversed***</p>
                    </div>
                    <div className="modal-footer gap-3">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={closeDialog}>Close</button>
                        <button type="button" className="btn btn-error ml-4" onClick={() => clickOk()}>Remove {isBlocked ? "Blockage" : "Booking"}</button>
                    </div>
                </div>
            </div>
        </dialog>
    )

    return dialogParam === 'y' ? dialog : null
}

export default RemBookingModal
