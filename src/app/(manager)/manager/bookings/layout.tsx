import ViewToggler from "@/components/bookings/manager/ViewToggler"


const ManBookingsLayout = ({ 
    children,

}: { 
    children: React.ReactNode
}) => {

    return (
        <>
            <h1 className="text-center text-4xl font-bold">
                Bookings
            </h1>

            
            <ViewToggler />

            <main>
                {children}
            </main>
        </>
    )
}

export default ManBookingsLayout