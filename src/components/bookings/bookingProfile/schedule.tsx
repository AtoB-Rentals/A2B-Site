import { DateTime } from 'luxon';
import { BookingI } from '../../../interface/api/booking';
import { vR } from '@/constants/requests/constants';


const Schedule = ({
    startTime,
    endTime
}:{
    startTime: BookingI['startTime']
    endTime: BookingI['endTime']
}) => {
    const sTime = DateTime.fromJSDate(new Date(startTime.goTime)).toLocal()
    const eTime = DateTime.fromJSDate(new Date(endTime.goTime)).toLocal()

    //**is a manager */
    const isMan = vR("admin", "manager")

    const editStyles = isMan ? "cursor-pointer hover:border-2 border-black rounded-md" : ""

    return (
        <>
            <div 
                className='flex flex-col md:flex-row justify-between items-center mb-2 text-lg text-center md:col-span-8'
            >
                <div className={`md:text-left transition-all ease ${editStyles}`}>
                    <p className='font-bold'>
                        Start Time:
                    </p>
                    <p>{sTime.toFormat('LLL d, yyyy')}</p>
                    <p>{sTime.toFormat('hh:mm a')}</p>
                </div>
                <span className='block bg-black w-[30%] h-[2px]'></span>
                <div className={`md:text-right transition-all ease ${editStyles}`}>
                    <p className='font-bold'>
                        End Time:
                    </p>
                    <p>{eTime.toFormat('LLL d, yyyy')}</p>
                    <p>{eTime.toFormat('hh:mm a')}</p>
                </div>
            </div>
        </>
    )
}

export default Schedule