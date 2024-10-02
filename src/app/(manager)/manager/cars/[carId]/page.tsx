'use client'

import { useEffect, useState } from "react"
import { CarI } from '../../../../../interface/api/car';
import { getCar } from "@/constants/requests/cars";
import { useRouter } from "next/navigation";
import CarProfile from "@/components/manager/cars/carId/profileCard/profile";
import AddPicture from "@/components/manager/cars/carId/AddPictureModal";

const ManagerCars = ({ params }: {
    params: { 
        carId: string
    }
}) => {
    const [ car, setCar ] = useState<CarI>()
    const router = useRouter()

    const handleGetCar = async () => {
        console.log('hydrating')
        const res = await getCar(params.carId)
        
        if (res.isErr) {
            alert('car not found')
            router.push('/manager/cars')
            return
        }

        setCar(res.data)
    }

    useEffect(() => {
        handleGetCar()
    }, [])

    if(!car) {
        return <main>
            <h1>Somthing went wrong</h1>
        </main>
    }

    return (
        <>
            <main>
                <CarProfile car={car} hydration={handleGetCar}/>
            </main>
            <AddPicture 
                car={ car }
                onSuccess={ handleGetCar }
            />
        </>
    )
}

export default ManagerCars