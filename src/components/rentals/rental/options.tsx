"use client"

import { numToDallor } from "@/constants/formatting/money"
import { getAddons } from "@/constants/requests/cars"
import { CarI } from "@/interface/api/car"
import { InvoiceItemI } from "@/interface/api/invoice"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

const Options = ({
    addOns
}: {
    addOns: CarI['addOns']
}) => {
    // const [ addons, setAddons ] = useState<CarI['addOns']>([])
    const [ err, setErr ] = useState<string>("")

    const q = useSearchParams()

    // const handleGetAddons = async () => {
    //     const res = await getAddons(carId)

    //     if (res.isErr) {
    //         setErr("Something went wrong")
    //         return
    //     }

    //     setAddons(res.data)
    // }

    // useEffect(() => {
    //     handleGetAddons()
    // //@ts-ignore
    // }, [])

    addOns = addOns || []

    return (
        <>
            <h3
                className="font-bold text-xl text-primary"
            >
                Add-ons:
            </h3>
            {err !== "" && <p
                    className="text-red-500 font-bold text-lg"
                >
                    {addOns ? null : "this can has not add-ons"}
                </p>
            }
            <div
                className="flex overflow-x-scroll md:w-full gap-3 p-3 h-full"
            >
                {addOns.map(a => (
                    <AddOn key={a.name} a={a} />
                ))}
            </div>
        </>
    )
}

const AddOn = ({
    a
}:{
    a: InvoiceItemI
}) => {
    const [ applied, setApplied ] = useState<boolean>(false)
    const [ quantity, setQuantity ] = useState<string>("1")

    const q = useSearchParams()

    useEffect(() => {
        const qAddon = q.get("xAd." +a.name)
        if(qAddon) {
            if (parseInt(qAddon) > 0) {
                setApplied(true)
                setQuantity(qAddon)
            }
        }
    }, []) 

    useEffect(() => {
        const params = new URLSearchParams(q.toString())
        if(applied) {
            params.set("xAd." + a.name, quantity)
            window.history.replaceState({}, '', `?${params.toString()}`)
        } else {
            params.delete(a.name)
            window.history.replaceState({}, '', `?${params.toString()}`)
        }
    }, [quantity, applied])

    useEffect(() => {
        if (quantity === "0") {
            setApplied(false)
            setQuantity("1")
        }
    }, [quantity])

    return (
        <Suspense>
            <div
                className="shadow-success shadow-[0px_0px_5px_1px] w-72 h-44 rounded-md p-2 flex flex-col gap-3 shrink-0"
                key={a.name}
            >
                <p className="font-bold text-lg">
                    {a.name}
                </p>
                <p
                    className="font-bold text-lg italic"
                >
                    {a.description}
                </p>
                <p className="text-lg text-bold text-success">
                    ${numToDallor(a.amount)}
                </p>
                {!applied && <button 
                    className="w-full rounded-md bg-blue-600 text-white text-lg p-2 hover:scale-105"
                    onClick={() => setApplied(true)}
                >
                    Apply
                </button>}
                {applied && a.type === 'Singular' && <button 
                    className="btn btn-success btn-outline w-full rounded-md border-2 text-lg p-2"
                    onClick={() => setApplied(false)}
                >
                    Applied
                </button>}
                {applied && a.type === 'Quantitative' && <div 
                    className="w-full flex justify-between"
                >
                    <button
                        className="size-10 rounded-md border-2 border-blue-600 flex justify-center items-center text-center text-2xl"
                        onClick={() => {
                            const int = parseInt(quantity) - 1
                            setQuantity(int.toString())
                        }}
                    >
                        -
                    </button>
                    <input 
                        type="number" 
                        name="quantity" 
                        id="quantity"
                        value={quantity}
                        onChange={e => {
                            e.preventDefault()
                            setQuantity(e.target.value)
                        }}
                        className="text-center w-10 rounded-md border-2 bg-transparent"
                    />
                    <button
                        className="size-10 rounded-md bg-blue-600 text-white flex justify-center items-center text-center text-2x"
                        onClick={() => {
                            const int = parseInt(quantity) + 1
                            setQuantity(int.toString())
                        }}
                    >
                        +
                    </button>
                </div>}
            </div>
        </Suspense>
    )
}

export default Options