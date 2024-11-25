import Filter from "@/components/public_cars/filter"
import { getCars } from "@/constants/requests/cars"
import { CarI } from '../../../../interface/api/car';
import CarCard from "@/components/public_cars/CarCard";
import { headers } from "next/headers";

interface RentalsParamsI {
    loc: string
}

interface ParsedLocation {
    type: 'state' | 'city' | 'country' | 'zipcode' | 'airport';
    value: string;
}

const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const parseLocation = async (location: string): Promise<[CarI[], string, boolean?]> => {
    const parts = location.split('-');
    const type = parts.shift()?.toLowerCase(); // Get the type and remove it from the parts array
    let filter = {}
    
    let locationString = ''

    if (type === 'airport') {
        let airport = parts.map(capitalize).join(' ')
        filter = { airport }
        locationString = airport
    } else if (type === 'city') {
        let city = parts.slice(0, -1).map(capitalize).join(' '); // Join all but the last as the city name
        let state = parts[parts.length - 1].toUpperCase(); // Last part is the state abbreviation
        filter = {
            city,
            state
        }
        locationString = `${city}, ${state}`
    } else if (type === 'zipcode') {
        let zipcode = parts.map(capitalize).join(' ')
        filter = {zipcode}
        locationString = zipcode
    } else if (type === 'country') {
        let country = parts.map(capitalize).join(' ')
        filter = {
            country: country
        }
        locationString = country
    } else if (type === 'state') {
        let state = parts.map(capitalize).join(' ')
        locationString = state
    }

    const res = await getCars(filter)
    if (res.isErr) {
        if (res.status === 500) {
            alert("somwething went wrong, please try again later")
        }
    }

    return [res.data, locationString, res.isErr]
}

const Rentals = async ({ params }: {params: RentalsParamsI}) => {
    const head = headers()

    const [ cars,   locStr ] = await parseLocation(params.loc)
    // if (err) {
    //     alert("something went wrong")
    // }

    return (
        <main className="md:mx-auto max-w-[1000px]">
            <h1
                className="text-3xl mx-3 text-blue-600 text-center md:text-left font-bold"
            >
                {locStr} Car Rentals
            </h1>
            <section
                className="p-2"
            >
                {/* <Filter initialLoc={locStr}/> */}
                <section className="mt-5 flex flex-col gap-4">
                    {cars.length && cars.map(c => <CarCard 
                        c={c}
                        key={c.id}
                    />)}
                    {!cars.length && <p className="text-2xl font-bold text-center">
                        Available cars not found in this area
                    </p>}
                </section>
            </section>
        </main>
    )
}

export default Rentals