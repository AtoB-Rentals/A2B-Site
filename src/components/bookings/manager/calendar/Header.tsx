'use state'
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const Header = ({
    dates
}: {
    dates: DateTime[]
}) => {

    return (
        <div className="flex border-b-2 border-primary">
            <div className="bg-base-300 w-32 shrink-0 border-primary border-r-2 to-base-300">
                <p className="text-primary text-center">
                    Cars
                </p>
            </div>
            {dates.map(date => (
                <div key={date.toUnixInteger()}className="bg-base-300 w-32 shrink-0 border-primary border-r-2 to-base-300">
                    <p className="text-primary text-center">
                        {date.toFormat('ccc, LLL dd')}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default Header