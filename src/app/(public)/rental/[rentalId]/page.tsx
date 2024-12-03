import { getCar } from "@/constants/requests/cars"
import Link from "next/link";
import RentalInfo from "@/components/rentals/rental/RentalInfo"
import { Metadata } from "next"
import { apiURL } from "@/constants/requests/constants";
import { CarI } from "@/interface/api/car";

interface RentalPageI {
    rentalId: string
}

async function fetchCarData(rentalId: string) {
  const res = await fetch(`${apiURL}/api/cars/${rentalId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
  })

  if (!res.ok) {
    return null
  }

  const data = await res.json()

  return data.data as CarI
}

// `generateMetadata` now receives the car data
export async function generateMetadata({ params }: { params: RentalPageI }): Promise<Metadata> {
  const car = await fetchCarData(params.rentalId);

  if (!car) {
    return {
      title: "Vehicle Not Found",
    };
  }

  return {
    title: car.name, // Set the page title dynamically
  };
}

const RentalPage = async ({ params }: {params: RentalPageI}) => {
    const car = await fetchCarData(params.rentalId)

    if (car === null) {
        return (
            <div
            className="text-blue-600 text-3xl text-center font-bold absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
        >
            <h1>Whoops could not find Vehicle</h1>
            <Link
                href='/rentals'
                className="font-bold text-white bg-blue-700 text-2xl rounded-md p-2"
            >
                Find Your Rental
            </Link>
        </div>
        )
    }

    return (
        <>
            <main className="max-w-[1000px] mx-3 lg:mx-auto">
                <h1 className="text-blue-400 text-4xl font-bold my-2">
                    {car.name}
                </h1>
                <RentalInfo car={car}/>
            </main>
        </>
    )
}

export default RentalPage