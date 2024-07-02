import Image from "next/image"
import { useState } from "react"
import { DateTime } from 'luxon'

const BookNow = () => {
    const [] = useState()

    const currentDate = DateTime.now()

    return (
        <section className="bg-[#1F6FE6] w-full p-10">
            <div className="text-center mb-8">
                <h2 className="text-4xl">
                    Make A Booking
                </h2>
            </div>
            <form className="p-8 flex justify-between w-full bg-white text-neutral-700 text-xl">
                <div>
                    <label htmlFor="pickup">Pickup</label>
                    <div className="flex gap-2">
                        <Image 
                            width={50}
                            height={50}
                            src="/images/location_pin.png"
                            alt="Location pin"
                            className="w-4"
                        />
                        <select 
                            id="sel_pickup"
                            className="bg-transparent active:border-neutral-900"
                        >
                            <option selected>CLT Airport (Home)</option>
                            <option>Delivery</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="dropOff">Drop Off</label>
                    <div className="flex gap-2">
                        <Image 
                            width={50}
                            height={50}
                            src="/images/location_pin.png"
                            alt="Location pin"
                            className="w-4"
                        />
                        <select 
                            id="sel_pickup"
                            className="bg-transparent active:border-neutral-900"
                        >
                            <option selected>CLT Airport (Home)</option>
                            <option>Delivery</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="from">From</label>
                    <div className="flex gap-2">
                        <Image 
                            width={50}
                            height={50}
                            src="/images/location_pin.png"
                            alt="Location pin"
                            className="w-4"
                        />
                        <input 
                            type="text" 
                            name="from" 
                            id="from" 
                            value={currentDate.plus({day: 1}).toFormat('M/dd/yy')}
                            className="bg-transparent active:border-neutral-900"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="until">Until</label>
                    <div className="flex gap-2">
                        <Image 
                            width={50}
                            height={50}
                            src="/images/location_pin.png"
                            alt="Location pin"
                            className="w-4"
                        />
                        <input 
                            type="text" 
                            name="until"
                            id="until"
                            placeholder="until"
                            className="bg-transparent active:border-neutral-900"
                            value={currentDate.plus({day: 3}).toFormat('M/dd/yy')}
                        />
                    </div>
                </div>
                <button
                    className="p-4 bg-orange-500 text-white"
                >
                    Rent Now
                </button>
            </form>
        </section>
    )
}

export default BookNow