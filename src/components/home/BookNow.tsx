import Image from "next/image"
import { DateTime } from 'luxon'
import { redirect } from "next/navigation"

const BookNow = () => {
    const currentDate = DateTime.now()

    async function handleForm(form: FormData) {
        'use server'
        console.log('former', form.get('startDate'))
        redirect('/book?data=' + encodeURIComponent(JSON.stringify(
            Object.fromEntries(form.entries())
        )))

    }

    console.log(currentDate.plus({day: 1}).toFormat('yyyy-MM-dd'))

    return (
        <section className="bg-[#1F6FE6] w-full p-10">
            <div className="text-center mb-8">
                <h2 className="text-4xl">
                    Make A Booking
                </h2>
            </div>
            <form 
                className="p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-start md:justify-between gap-3 w-full bg-white text-neutral-700 text-xl"
                action={handleForm}
            >
                <div className="text-center lg:text-left">
                    <label 
                        htmlFor="pickupAddress"
                        className="font-bold justify-center"
                    >
                        Pickup
                    </label>
                    <div className="flex">
                        <select 
                            id="pickupAddress"
                            className="bg-transparent w-full md:w-auto active:border-neutral-900 text-center lg:text-left"
                            name="pickupAddress"
                            defaultValue="CLT Airport"
                        >
                            <option>CLT Airport</option>
                            <option>Delivery</option>
                        </select>
                    </div>
                </div>
                <div className="text-center lg:text-left">
                    <label 
                        htmlFor="dropoffAddress"
                        className="font-bold text-center lg:text-left"
                    >
                        Drop Off</label>
                    <div className="flex gap-2">
                        <select 
                            id="dropoffAddress"
                            className="bg-transparent active:border-neutral-900"
                            name="dropoffAddress"
                            defaultValue="CLT Airport"
                        >
                            <option>CLT Airport</option>
                            <option>Delivery</option>
                        </select>
                    </div>
                </div>
                <div className="text-center lg:text-left">
                    <label 
                        htmlFor="startDate"
                        className="font-bold text-center lg:text-left"
                    >
                        From
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="date" 
                            name="startDate" 
                            id="startDate" 
                            defaultValue={currentDate.plus({day: 1}).toFormat('yyyy-MM-dd')}
                            className="bg-transparent active:border-neutral-900 w-full text-center lg:text-left"
                        />
                    </div>
                </div>
                <div className="text-center lg:text-left">
                    <label 
                        htmlFor="endDate"
                        className="font-bold text-center lg:text-left"
                    >
                        Until
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="date" 
                            name="endDate"
                            id="endDate"
                            placeholder="until"
                            className="bg-transparent active:border-neutral-900 w-full text-center lg:text-left"
                            defaultValue={currentDate.plus({day: 3}).toFormat('yyyy-MM-dd')}
                        />
                    </div>
                </div>
                <button
                    className="p-4 bg-orange-500 text-white w-full lg:w-auto lg:min-w-fit"
                >
                    Rent Now
                </button>
            </form>
        </section>
    )
}

export default BookNow