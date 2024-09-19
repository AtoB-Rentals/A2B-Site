'use client'

import { getCars } from "@/constants/requests/cars"
import { CarI } from "@/interface/api/car"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import ManCarCard from "./card"
import Link from "next/link"
import AddCarModal from '../../modals/cars/addCarModal';

const ListCars = () => {
    const [cars, setCars] = useState<CarI[]>([])
    const router = useRouter()
    
    const handleGetCars = () => {
        getCars()
            .then(res => {
                if(res.isErr) {
                    if (res.status === 401 || res.status === 403) {
                        Cookies.remove("token")
                        router.push('/manager/login')
                    }
                } else {
                    setCars([...res.data])
                    console.log("should have updated")
                }
            })
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