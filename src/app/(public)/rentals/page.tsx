import CarCard from "@/components/modals/public_cars/CarCard";
import Filter from "@/components/modals/public_cars/filter"
import { getIPData, IPDataI } from "@/constants/ip";
import { getCar, getCars } from "@/constants/requests/cars";
import { QueryParams } from "@/constants/requests/constants";
import { CarI } from "@/interface/api/car";
import { headers } from "next/headers";
import { useSearchParams } from 'next/navigation';

async function Rentals({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
    const head = headers()
    const ip = head.get('X-Client-IP')
    let ipD: IPDataI | null = null
    let cars: CarI[] = []

    let locationStr = ""
    
    if (ip !== null) {
        ipD = await getIPData(ip)
    }

    if (ipD) {
        locationStr = `${ipD.city}, ${ipD.region}, ${ipD.country}`
    }

    const handleGetCars = async () => {
        console.log("search city", searchParams['city'])
        console.log("search state", searchParams['region'])

        const res = await getCars()

        if (res.isErr) {
            alert('Something went wrong. Please try again later')
            return
        }

        cars = res.data
    }

    await handleGetCars()

    return (
        <div>
            <section
                className="p-2"
            >
                <Filter 
                    initialLocStr={ locationStr }
                    defaultLocation={ipD ? {
                        state: ipD.region,
                        city: ipD.city,
                        country: ipD.country,
                        lat: ipD.latitude,
                        long: ipD.longitude
                    } : undefined}
                />
                <section className="mt-5 flex flex-col gap-4">
                    {cars.map(c => (
                        <CarCard
                            c={c}
                            key={c.id}
                        />
                    ))}
                    {!cars.length && <p className="text-2xl font-bold text-center">
                        Available cars not found
                    </p>}
                </section>
            </section>
        </div>
    )
}

export default Rentals