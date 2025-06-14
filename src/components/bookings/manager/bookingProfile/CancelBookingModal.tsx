'use client'
import Loading from "@/components/assets/loading";
import { numToDallor } from "@/constants/formatting/money";
import { cancelBooking } from "@/constants/requests/bookings"
import useModal from "@/hooks/ModalHook";
import { BookingI } from "@/interface/api/booking";
import { useRouter } from "next/navigation"
import { useState } from "react";


const CancelBookingModal = ({
    booking
}: {
    booking: BookingI
}) => {
    const router = useRouter()
    const [ reason, setReason ] = useState<string>('')
    const [ refund, setRefund ] = useState<boolean>(booking.status === 'Scheduled')
    const [ refundAmount, setRefundAmount ] = useState<number>(0)

    const handleCancelBooking = async (): Promise<boolean> => {
        if (!reason) {
            alert('Please provide a reason for cancellation')
            return false
        }

        reason.trim()
        if (reason.length < 10) {
            alert('Please provide a reason with at least 10 characters')
            return false
        }
        if (reason.length > 1000) {
            alert('Please provide a reason with less than 1000 characters')
            return false
        }

        if (refundAmount > booking.totalPrice) {
            alert('Refund amount cannot be greater than total price')
            return false
        }

        const res = await cancelBooking(booking.id, {
            reason,
            refund,
            refundAmount
        })

        if (res.isErr) {
            if (res.status === 400 || res.status === 404) {
                alert(res.message)
                return true
            }
            return false
        }

        router.refresh()

        return true
    }

    const { 
        dialogParam,
        dialogRef,
        closeDialog,
        clickOk,
        loading
    } = useModal({
        paramKey: 'cancel_booking',
        onOk: handleCancelBooking
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
                <form className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title font-bold text-secondary text-lg" id="cancelModalLabel">Cancel booking</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body my-8">
                        <p>Are you sure you want to cancel this booking?</p>
                        <div className="form-control w-full max-w-xs">
                            <label
                                className="label"
                                htmlFor="reason"
                            >
                                <span className="label-text">Reason for cancellation</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full max-w-xs"
                                placeholder="Reason for cancellation"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                id="reason"
                                required
                                minLength={10}
                                maxLength={1000}
                                rows={4}
                                style={{ resize: 'none' }}
                                autoFocus={true}
                            />
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label
                                className="label cursor-pointer"
                                htmlFor="refund"
                            >
                                <span className="label-text">Refund</span>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary ml-4"
                                    checked={refund}
                                    onChange={(e) => setRefund(e.target.checked)}
                                    id="refund"
                                />
                            </label>
                        </div>
                        {refund && <>
                            <p className="text-sm text-gray-500">*Refund will be processed within 5-7 business days</p>
                            <div className="flex flex-col items-start">
                                <label htmlFor="refundAmound">Refund Amount</label>
                                <input 
                                    type="number" 
                                    name="refundAmount" 
                                    id="refundAmount" 
                                    className="input" 
                                    max={booking.totalPrice}
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                                />
                            </div>
                            <p>Maximum: 
                                <span className="text-secondary font-bold"> ${numToDallor(booking.totalPrice)}</span>
                            </p>
                        </>}
                    </div>
                    <div className="modal-footer gap-3">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeDialog}>Close</button>
                        <button type="submit" className="btn btn-error ml-4" onClick={() => clickOk()}>Cancel Booking</button>
                    </div>
                </form>
            </div>
        </dialog>
    )

    return dialogParam === 'y' ? dialog : null
}

export default CancelBookingModal