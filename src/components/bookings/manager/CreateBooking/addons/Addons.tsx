'use client';

import { numToDallor } from "@/constants/formatting/money";
import { metersToMiles } from "@/constants/location/googleRequest";
import { calcDistance } from "@/constants/requests/bookings";
import { PickDropI } from "@/interface/api/address";
import { AddonI, BookingI } from "@/interface/api/booking";
import { CarI } from "@/interface/api/car";
import { InvoiceItemI, ReqInvoiceItemI } from "@/interface/api/invoice";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import AddAddonModal from "./AddAddonModal";

const Addons = ({ 
    car,
    addons,
    addresses,
    updateAddons
}: {
    car: CarI,
    addons: BookingI["addons"],
    addresses: PickDropI
    updateAddons: (addons: BookingI['addons']) => void
}) => {
    const router = useRouter()

    const [
        /**
         * This is considered additional addons that are not part of the car.
         */
        displayAddons, 
        setDisplayAddons
    ] = useState<BookingI["addons"]>([])

    const manageItems = (addonItem: ReqInvoiceItemI, subtract: boolean, setQuantity?: number) => {
        const item = addons.find(item => item.name === addonItem.name)
        if (!item) {
            if (subtract) return

            updateAddons([
                ...addons,
                {
                    name: addonItem.name,
                    description: addonItem.description,
                    quantity: setQuantity || 1,
                    amount: addonItem.amount,
                    total: addonItem.amount * (setQuantity || 1),
                    type: addonItem.type,
                }
            ])

            return
        }

        //index of item
        const index = addons.findIndex(item => item.name === addonItem.name)

        const removeItem = () => {
            const newItems = addons.filter(item => item.name !== addonItem.name)
            updateAddons([...newItems])
        }

        if (setQuantity || setQuantity === 0) {
            if (setQuantity < 0) {
                removeItem()
                return
            }
            addons[index].quantity = setQuantity
            updateAddons([...addons])
            return
        }

        if (subtract && item.quantity === 1) {
            removeItem()
            return
        }

        addons[index].quantity = subtract ? item.quantity - 1 : item.quantity + 1
        updateAddons([...addons])
    }

    const addAddon = (addon: BookingI["addons"][0]) => {
        const item = addons.find(item => item.name === addon.name)
        if (!item) {
            updateAddons([
                ...addons,
                {
                    name: addon.name,
                    description: addon.description,
                    quantity: 1,
                    amount: addon.amount,
                    total: addon.amount * 1,
                    type: addon.type,
                }
            ])
            displayAddons.push({
                name: addon.name,
                description: addon.description,
                quantity: 1,
                amount: addon.amount,
                total: addon.amount * 1,
                type: addon.type,
            })
            setDisplayAddons([...displayAddons])
            return
        }
    }

    const handleDistance = async () => {
        if (!addresses.pickup?.placeId) return null
        if (addresses.pickup.placeId === car.address.placeId) return null

        let distance = await calcDistance(
            addresses.pickup.placeId,
            car.address.placeId
        )

        if (!distance) return null
        distance = metersToMiles(distance)
        
        /**
         * * Check if the delivery addon is already in the addons list
         */
        const addonIndex = addons.findIndex(addon => addon.name === "Delivery")
        /**
         * find the delivery addon in the display addons list
         */
        const displayAddonIndex = displayAddons.findIndex(addon => addon.name === "Delivery")
        let newAddons: BookingI["addons"] = [...addons]
        const newDisplayAddons = [...displayAddons]

        let amount = 60 * distance
        amount = Math.round(amount)


        const newDevAddon: AddonI = {
            name: "Delivery",
            description: `Delivery Distance ${distance} miles/$0.60 per mile`,
            quantity: 1,
            amount,
            total : 0,
            type: "Singular",
        }

        if (addonIndex === -1) {
            newAddons.push(newDevAddon)
        } else {
            newDisplayAddons[displayAddonIndex].quantity = 1
            newDisplayAddons[displayAddonIndex].amount = amount
            newDisplayAddons[displayAddonIndex].description = `Delivery Distance ${distance} miles/$0.60 per mile`
            newAddons[addonIndex].total = 60 * distance
        }

        if (displayAddonIndex === -1) {
            newDisplayAddons.push(newDevAddon)
        } else {
            newDisplayAddons[displayAddonIndex].quantity = 1
            newDisplayAddons[displayAddonIndex].amount = amount
            newDisplayAddons[displayAddonIndex].description = `Delivery Distance ${distance} miles/$0.60 per mile`
        }
        
        setDisplayAddons([...newDisplayAddons])
        updateAddons([...newAddons])
    }
    

    useEffect(() => {
        // handleDistance()
        console.table(addons)
        console.log("Display Addons: ", displayAddons)
    }, [addons])

    useEffect(() => {
        if (addresses.pickup?.placeId) {
            handleDistance()
        } else {
            //remove delivery addon from display addons and addons
            const deliveryAddonIndex = displayAddons.findIndex(addon => addon.name === "Delivery")
            if (deliveryAddonIndex !== -1) {
                const newAddons = displayAddons.filter(addon => addon.name !== "Delivery")
                setDisplayAddons(newAddons)
            }
            const deliveryAddonIndex2 = addons.findIndex(addon => addon.name === "Delivery")
            if (deliveryAddonIndex2 !== -1) {
                const newAddons = addons.filter(addon => addon.name !== "Delivery")
                updateAddons(newAddons)
            }
        }
    }, [addresses])

    if (car.addOns.length + displayAddons.length === 0) {
        return (
            <>
                <section className="w-full flex flex-col gap-4 mt-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary">Add ons</h2>
                        <p className="text-lg text-gray-500">
                            No add ons available for this vehicle.
                        </p>
                    </div>
                    {/* Add addon */}
                    <div>
                        <button
                            className="w-full bg-primary text-white p-4 rounded-md hover:bg-primary-dark transition duration-200"
                            onClick={e => {
                                e.preventDefault()
                                router.push(`/manager/booking/new?car_id=${car?.id || ""}&add_addon=y`)
                            }}
                        >
                            Add Addon
                        </button>
                    </div>
                </section>
                <AddAddonModal 
                    addons={addons}
                    addAddon={addAddon}
                />
            </>
        );
    }

    return (
        <>
            <section className="w-full flex flex-col gap-4 mt-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary">Add ons</h2>
                    <p className="text-lg text-gray-500">
                        Select any additional services you would like to add to your booking.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    {/* Addons List */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-md font-semibold">Available Addons</h3>
                        {/* Addon Item */}
                        {[...car.addOns, ...displayAddons].map((addon, index) => (<>

                            {addon.type === "Quantitative" && <div 
                                key={index} 
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg h-20"
                            >
                                <div>
                                    <h4 className="text-md font-semibold">{addon.name}</h4>
                                    <p className="text-sm text-gray-500">{addon.description}</p>
                                    <p className="text-sm text-green-500">${numToDallor(addon.amount)}</p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="bg-error p-2 rounded-md text-sm text-black"
                                        onClick={e => {
                                            e.preventDefault()
                                            manageItems(addon, true)
                                        }}
                                    >
                                        Minus
                                    </button>
                                    <input
                                        type="number"
                                        min={0}
                                        // max={addon.maxQuantity}
                                        defaultValue={0}
                                        value={addons.find(item => item.name === addon.name)?.quantity || ""}
                                        className="w-16 p-2 border border-gray-300 rounded-md text-center"
                                        onChange={e => {
                                            e.preventDefault()
                                            const value = parseInt(e.target.value)
                                            if (e.target.value === "0" || value < 0  || !e.target.value) {
                                                // remove item if value is 0 or empty
                                                manageItems(addon, false, 0)
                                                return
                                            }

                                            manageItems(addon, false, value)
                                        }}
                                    />
                                    <button 
                                        className="bg-success p-2 rounded-md text-sm text-black"
                                        onClick={e => {
                                            e.preventDefault()
                                            manageItems(addon, false)
                                        }}
                                    >
                                        Plus
                                    </button>
                                </div>
                            </div>}

                            {addon.type === "Singular" && <button 
                                key={index} 
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg h-20"
                                onClick={e => {
                                    e.preventDefault()
                                    manageItems(addon, addons.some(item => item.name === addon.name))
                                }}
                            >
                                <div className="text-left">
                                    <h4 className="text-md font-semibold">{addon.name}</h4>
                                    <p className="text-sm text-gray-500">{addon.description}</p>
                                    <p className="text-sm text-green-500">${numToDallor(addon.amount)}</p>
                                </div>
                                <input 
                                    type="checkbox"
                                    checked={addons.some(item => item.name === addon.name)}
                                    className="w-6 h-6 border border-gray-300 rounded-md accent-[#3B82F6]"
                                    aria-label="Select Addon"
                                />
                            </button>}
                        </>))}
                    </div>
                </div>
                {/* Add addon */}
                <div>
                    <button
                        className="w-full bg-primary text-white p-4 rounded-md hover:bg-primary-dark transition duration-200"
                        onClick={e => {
                            e.preventDefault()
                            router.push(`/manager/booking/new?car_id=${car?.id || ""}&add_addon=y`)
                        }}
                    >
                        Add Addon
                    </button>
                </div>
            </section>
            <AddAddonModal 
                addons={addons}
                addAddon={addAddon}
            />
        </>
    );
}

export default Addons