

const Cars = () => {
    
    return (
        <div>
            <h1
                className="text-3xl text-blue-600 text-center md:text-left font-bold"
            >
                Cars
            </h1>
            <section
                className="p-2"
            >
                <div
                    id="filter"
                    className="w-full p-3 rounded-md text-lg shadow-gray-200 shadow-[0px_0px_10px_10px]"
                >
                    <input 
                        type="text" 
                        name="address" 
                        id="address"
                        className="border rounded-md border-gray-600 p-1 w-full mb-2"
                        placeholder="Location"
                    />
                    <div
                        className="flex justify-between gap-2"
                    >
                        <input 
                            type="date" 
                            name="startTime" 
                            id="startTime"
                            className="w-full p-1 rounded-md border border-gray-600"
                            />
                        <input 
                            type="date" 
                            name="endTime" 
                            id="endTime" 
                            className="w-full p-1 rounded-md border border-gray-600"
                        />
                    </div>

                </div>

            </section>
        </div>
    )
}

export default Cars