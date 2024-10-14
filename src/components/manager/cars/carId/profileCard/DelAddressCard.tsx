import { AddressI } from '../../../../../interface/api/address';


const DeliverAddressCard = ({
    a,
    remove
}: {
    a: AddressI
    remove: (placeId: string) => void
}) => {

    return (
        <div className='relative capitalize h-32 bg-slate-300 rounded-md p-3'>
            <p className='font-bold text-lg'>
                {a.type}
            </p>
            <p className=''>
                {a.formatted}
            </p>
            <button 
                className='absolute top-3 right-3 text-red-600 font-bold text-xl'
                onClick={() => remove(a.placeId)}
            >
                X
            </button>
        </div>
    )
}

export default DeliverAddressCard