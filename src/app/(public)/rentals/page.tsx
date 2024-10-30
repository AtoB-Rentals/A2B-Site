import Filter from "@/components/public_cars/filter"
import PubCarList from "@/components/public_cars/PubCarList";
import { getIPData, IPDataI } from "@/constants/ip";
import { headers } from "next/headers"

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

    let locationStr = ""
    
    if (ip !== null) {
        ipD = await getIPData(ip)
    }

    if (ipD) {
        locationStr = `${ipD.city}, ${ipD.region}, ${ipD.country}`
    }

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
                    <PubCarList />
                </section>
            </section>
        </div>
    )
}

export default Rentals