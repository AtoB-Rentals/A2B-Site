import StripeCheckout from "@/components/checkout/StripeCheckout"
import { getBookingById } from "@/constants/requests/bookings"
import { apiURL } from "@/constants/requests/constants"
import { BookingI } from "@/interface/api/booking"
import { cookies } from "next/headers"

const getBooking = async (bookingId: string): Promise<boolean> => {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("next-auth-token");

    const res = await fetch(
      `${apiURL}/api/bookings/${bookingId}/is_intent_paid`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie
            ? `${sessionCookie.name}=${sessionCookie.value}`
            : "",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            return false
        }
        return false
    }

    const data = await res.json()

    return data.data as boolean
}


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