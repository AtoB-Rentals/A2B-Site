import { DateTime } from 'luxon';
import { BookingI } from '../../../interface/api/booking';


const Schedule = ({
    startTime,
    endTime
}:{
    startTime: BookingI['startTime']
    endTime: BookingI['endTime']
}) => {
    const sTime = DateTime.fromJSDate(new Date(startTime.goTime)).toLocal()
    const eTime = DateTime.fromJSDate(new Date(endTime.goTime)).toLocal()

    return (
        <div className='flex justify-between items-center mb-2 text-lg'>
            <div>
                <p className='font-bold'>
                    Start Time:
                </p>
                <p>{sTime.toFormat('LLL d, yyyy hh:mm a')}</p>
            </div>
            <span className='block bg-black w-[30%] h-[2px]'></span>
            <div className='text-right'>
                <p className='font-bold'>
                    End Time:
                </p>
                <p>{eTime.toFormat('LLL d, yyyy hh:mm a')}</p>
            </div>
        </div>
    )
}

export default Schedule