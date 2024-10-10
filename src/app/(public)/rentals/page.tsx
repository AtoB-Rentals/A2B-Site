import Filter from "@/components/modals/public_cars/filter"
import { getIPData, IPDataI } from "@/constants/ip";
import { getCar, getCars } from "@/constants/requests/cars";
import { CarI } from "@/interface/api/car";
import { headers } from "next/headers";




async function Rentals() {
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

            </section>
        </div>
    )
}

export default Rentals