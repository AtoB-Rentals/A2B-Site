import GetUserMain from "@/components/rentals/rental/get_user"
import { getIPData, IPDataI } from "@/constants/ip"
import { headers } from "next/headers"


const RentalNewUserPage = async ({params}: {params: {
    rentalId: string
}}) => {
    const head = headers()
    const ip = head.get('X-Client-IP')
    let ipD: IPDataI | null = null
    
    if (ip !== null) {
        ipD = await getIPData(ip)
    }
    
    const timezone = ipD?.timezone || ""

    return (
        <section>
            <GetUserMain carId={params.rentalId} timezone={timezone}/>
        </section>
    )
}

export default RentalNewUserPage