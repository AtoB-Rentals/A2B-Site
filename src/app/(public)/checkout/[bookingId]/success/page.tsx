import { apiURL } from "@/constants/requests/constants";
import { BookingI } from "@/interface/api/booking";
import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/utils/authOptions";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { numToDallor } from "@/constants/formatting/money";

export const metadata: Metadata = {
    title: "Booking Success",
    description: "Your booking was successful!",
};

const getBooking = async (bookingId: string) => {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("next-auth-token");

    const res = await fetch(`${apiURL}/api/bookings/${bookingId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: sessionCookie
                ? `${sessionCookie.name}=${sessionCookie.value}`
                : "",
        },
        credentials: "include",
    });

    if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            return "Not Authorized";
        }
        console.log("NULL");
        return null;
    }

    const data = await res.json();

    return data.data as BookingI;
};

const Success = async ({
    params,
}: {
    params: {
        bookingId: string;
    };
}) => {
    const booking = await getBooking(params.bookingId);
    const session = await getServerSession(authOptions);

    const h1 = () => {
        let msg = "";
        if (booking === null) {
            msg = "Unable to find this booking";
        }
        if (booking === "Not Authorized") {
            msg = "This is not your booking";
        }
        return msg;
    };

    if (booking === null || booking === "Not Authorized") {
        return (
            <main className="pb-28">
                <div className="flex flex-col gap-3 h-[70vh] justify-center items-center">
                    <h1 className="text-xl">{h1()}</h1>
                    <div className="flex gap-3">
                        <Link className="btn btn-primary" href={"/"}>
                            Home
                        </Link>
                        {
                            // this needs to be a client component button that stores this url in the localstorage redirect
                            !session?.user.email && (
                                <Link
                                    href={"/login"}
                                    className="btn btn-secondary btn-outline"
                                >
                                    Login
                                </Link>
                            )
                        }
                    </div>
                </div>
            </main>
        );
    }

    if (booking.status === "Draft") {
        redirect(`/checkout/${booking.id}`);
    }

    const startTimef = DateTime.fromISO(booking.startTime.utc)
        .toLocal()
        .toFormat("LLL d, yyyy t");

    const endTimef = DateTime.fromISO(booking.endTime.utc)
        .toLocal()
        .toFormat("LLL d, yyyy t");

    return (
        <main className="max-w-[1000px] mx-3 lg:mx-auto">
            <section className="rounded-md shadow-[0px_0px_4px_1px] shadow-success pt-2 pb-6">
                {/* Successfully scheduled */}
                <div className="flex items-center flex-col">
                    <Image
                        alt="checked"
                        src="/images/image.png"
                        width={100}
                        height={100}
                        className="motion-preset-bounce "
                    />
                    <h1 className="text-lg md:text-xl text-success font-bold motion-preset-confetti">
                        Booking Scheduled!
                    </h1>
                </div>
                {/* Booking image */}
                <div className="flex justify-center max-w-[600] relative my-4">
                    <Image
                        src={booking.vehicle.profilePicture.url}
                        alt={booking.vehicle.name}
                        width={300}
                        height={300}
                        className="rounded-md border-2 border-base-300"
                    />
                </div>
                {/* Booking Details section */}
                <section className="flex flex-col gap-4 rounded-md py-4 p-2 text-center max-w-[600px] mb-4 mx-3 md:mx-auto bg-base-200 shadow-base-300 shadow-[inset_0px_4px_8px]">
                    <div className="flex flex-col md:flex-row items-center md:justify-between">
                        <h3 className="font-bold">Vehicle</h3>
                        <p>{booking.vehicle.name}</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-between">
                        <h3 className="font-bold">Start Time</h3>
                        <p>{startTimef}</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-between">
                        <h3 className="font-bold">Return Time</h3>
                        <p>{endTimef}</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-between">
                        <h3 className="font-bold">Pickup</h3>
                        <Link
                            href={`https://www.google.com/maps?q=${encodeURIComponent(
                                booking.pickupAddress.formatted
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary truncate max-w-xs md:max-w-sm overflow-hidden whitespace-nowrap"
                        >
                            {booking.pickupAddress.formatted}
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-between">
                        <h3 className="font-bold">Return</h3>
                        <Link
                            href={`https://www.google.com/maps?q=${encodeURIComponent(
                                booking.dropOffAddress.formatted
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary truncate max-w-xs md:max-w-sm overflow-hidden whitespace-nowrap"
                        >
                            {booking.dropOffAddress.formatted}
                        </Link>
                    </div>
                    <span className="block w-full h-[2px] rounded-full bg-base-300"></span>
                    <div className="flex flex-col md:flex-row items-center py-1 md:justify-between">
                        <h3 className="font-bold">Total</h3>
                        <p className="font-bold text-success text-lg">
                            ${numToDallor(booking.totalPrice)}
                        </p>
                    </div>
                </section>
                <section className="flex flex-col gap-4 rounded-md py-4 p-2 max-w-[600px] mb-4 mx-3 md:mx-auto bg-[#E9F4EC] shadow-base-300 shadow-[inset_0px_4px_8px] text-black">
                    <div>
                        <h2 className="font-bold text-lg">Next Steps:</h2>
                    </div>
                    <ul className="list-disc pl-5">
                        <li>
                            A confirmation email has been sent to your
                            registered email address
                        </li>
                        <li>
                            Please bring your driver's license and credit card
                            used for booking
                        </li>
                        <li>
                            Contact our 24/7 support if you need any assistance
                            -{" "}
                            <Link
                                href="tel:+19802063002"
                                target="_blank"
                                className="link link-secondary"
                            >
                                (980)206-3002
                            </Link>
                        </li>
                    </ul>
                </section>
                {/* Actions */}
                <section className="flex justify-center gap-4">
                    <Link
                        className="btn btn-primary"
                        href={`/bookings/${booking.id}`}
                    >
                        View Booking
                    </Link>
                    <Link className="btn btn-secondary btn-outline" href="/">
                        Return Home
                    </Link>
                </section>
            </section>
        </main>
    );
};

export default Success;
