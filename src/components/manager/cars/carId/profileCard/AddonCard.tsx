import { numToDallor } from "@/constants/formatting/money"
import { InvoiceItemI } from "@/interface/api/invoice"


const AddonCard = ({
    addOn, remove
}: {
    addOn: InvoiceItemI
    remove: (name: string) => void
}) => {

    return (
        <div className='relative capitalize h-32 bg-base-300 rounded-md p-3'>
            <p className='font-bold text-lg'>
                {addOn.name} {numToDallor(addOn.amount)}
            </p>
            <p className=''>
                {addOn.description}
            </p>
            <button 
                className='absolute top-3 right-3 text-red-600 font-bold text-xl'
                onClick={() => remove(addOn.name)}
            >
                X
            </button>
        </div>
    )
}

export default AddonCard