"use client"
import ListCars from "@/components/manager/cars/listCars"
// import ListCars from "@/components/manager/cars/listCars"
import dynamic from "next/dynamic"

// const DynamicComponentWithNoSSR = dynamic(
//   () => import('@/components/manager/cars/listCars'),
//   { ssr: false }
// )

const ManagerCars = () => {
    

    return (
        <main>
            <ListCars />
        </main>
    )
}

export default ManagerCars