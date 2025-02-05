'use client'

import { getCars } from "@/constants/requests/cars"
import { CarI } from "@/interface/api/car"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import ManCarCard from "./card"
import Link from "next/link"
import AddCarModal from "@/components/modals/cars/addCarModal"

const ListCars = () => {
    const [cars, setCars] = useState<CarI[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()
    
    // const handleGetCars = () => {
    //     setLoading(true)
    //     getCars()
    //         .then(res => {
    //             if(res.isErr) {
    //                 if (res.status === 401) {
    //                     Cookies.remove("token")
    //                     router.push('/manager/login')
    //                 }
    //                 console.log('the error happened', res.data)
    //             } else {
    //                 setCars([...res.data])
    //                 console.log("should have updated")
    //             }
    //         })
    //         .finally(() => setLoading(false))
    // }

    const handleGetCars = async () => {
        setLoading(true)
        try {
            const res = await getCars()
            if(res.isErr) {
                if (res.status === 401) {
                    // Cookies.remove("token")
                    router.push('/manager/login')
                }
            } else {
                setCars([...res.data])
            } 
        } catch(e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetCars()
    }, [])

    return (
        <>
            <section>
                <div className="flex justify-between bg-slate-500 px-6 py-5 mb-5 mx-5 rounded-md">
                    <div></div>
                    <div>
                        <Link
                            href="/manager/cars?addCarModal=y"
                            className="bg-orange-500 py-3 px-3 rounded-md"
                        >
                            Add Vehicle
                        </Link>
                    </div>
                </div>
                {cars.length === 0 && !loading && <div className="text-center">
                    <p className="font-bold text-lg text-blue-500">
                        No Cars Found
                    </p>
                </div>}
                {loading && <div className="text-center">
                    <p className="font-bold text-lg text-blue-500">
                        Loading...
                    </p>
                </div>}
                <div 
                    className="flex flex-wrap gap-12 max-w-4xl mx-3 md:mx-auto justify-center"
                >
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {
                            cars.map(car => (
                                <ManCarCard 
                                    key={car.id}
                                    {...car}
                                />
                            ))
                        }
                    </div>
                </div>
            </section>
            <AddCarModal onSuccess={handleGetCars}/>
        </>
    )
}

export default ListCars