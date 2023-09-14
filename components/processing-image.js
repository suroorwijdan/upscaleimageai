import {Icons} from "@/components/icons";

export function ProcessingImage() {

    return (
        <div
            className='flex flex-col justify-center items-center border border-gray-700 p-20 rounded-l tracking-tighter'>
            <Icons.spinner className='animate-spin h-10 w-10'/>
            <p className='mt-5'>Your image is processing...</p>
        </div>
    )
}
