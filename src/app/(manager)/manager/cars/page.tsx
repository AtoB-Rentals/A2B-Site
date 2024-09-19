"use client"
// import ListCars from "@/components/manager/cars/listCars"
import dynamic from "next/dynamic"

const DynamicComponentWithNoSSR = dynamic(
  () => import('@/components/manager/cars/listCars'),
  { ssr: false }
)

const ManagerCars = () => {
    

    return (
        <main>
            <DynamicComponentWithNoSSR />
        </main>
    )
}

export default ManagerCars