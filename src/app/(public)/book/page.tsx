import BookingForm from "@/components/book/bookingform"
import { ReqBookingI } from "@/interface/api/booking";
import { z } from "zod";

;

const Book = ({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined }
}) => {
    let searchData = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        insuranceProvider: "",
        policyNumber: "",
        startDate: "",
        endDate: "",
        dropoffAddress: "",
        pickupAddress: "",
    };

    if (searchParams && typeof searchParams === 'object' && searchParams.data) {
        try {
            const searchDataJson = searchParams.data as string;
            const parsedData = JSON.parse(searchDataJson);
            const validatedData = BookingRequestBodySchema.parse(parsedData);
            searchData = { ...searchData, ...validatedData };
        } catch (error) {
            console.error('Invalid searchParams data:', error);
        }
    }

    return (
        <h1>Booking page is gonna need some work</h1>
        // <BookingForm 
        //     firstName={searchData.firstName}
        //     lastName={searchData.lastName}
        //     phone={searchData.phone}
        //     email={searchData.email}
        //     insuranceProvider={searchData.insuranceProvider}
        //     policyNumber={searchData.policyNumber}
        //     startDate={searchData.startDate}
        //     endDate={searchData.endDate}
        //     dropoffAddress={searchData.dropoffAddress}
        //     pickupAddress={searchData.pickupAddress} 
        //     phoneNumber={""} 
        //     startTime={{
        //         local: "",
        //         iana: ""
        //     }} endTime={{
        //         local: "",
        //         iana: ""
        //     }}            
        // />
    )
}

export default Book;
