import StripeCheckout from "@/components/checkout/StripeCheckout"
import { getBookingById } from "@/constants/requests/bookings"
import { apiURL } from "@/constants/requests/constants"
import { BookingI } from "@/interface/api/booking"


const CheckoutPage = async ({
    params
}: {
    params: {
        bookingId: string
    }
}) => {
    return (
        <div>
            <h1
                className="text-center font-bold text-2xl text-secondary"
            >
                Checkout
            </h1>
            <StripeCheckout 
                bookingId={params.bookingId}
            />
        </div>

    )
}

export default CheckoutPage