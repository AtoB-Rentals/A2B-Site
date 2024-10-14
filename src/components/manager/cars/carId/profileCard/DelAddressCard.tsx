import { AddressI } from '../../../../../interface/api/address';


const DeliverAddressCard = ({
    a
}: {
    a: AddressI
}) => {

    return (
        <div className='relative capitalize h-32 bg-slate-300 rounded-md p-3'>
            <p className='font-bold text-lg'>
                {a.type}
            </p>
            <p className=''>
                {a.formatted}
            </p>
            <div className='absolute top-3 right-3 text-red-600 font-bold text-xl'>
                X
            </div>
        </div>
    )
}

export default DeliverAddressCard