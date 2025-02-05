import Image from 'next/image'

const Loading = () => {
    return (
        <section className=''>
            <Image 
                src='/images/logo_icon.png'
                alt='loading'
                width={100}
                height={100}
                className='mx-auto motion-preset-wobble -translate-x-2'
            />
            <span className='block h-px mt-px bg-gradient-to-r from-secondary to-primary mx-auto w-48 rounded full'></span>
        </section>
    )
}

export default Loading