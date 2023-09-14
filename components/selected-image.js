"use client";

import {Button} from "@/components/ui/button";
import {useEffect, useRef} from "react";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import Image from "next/image";

export const SelectedImage = ({data}) => {
    const {file, preview} = data;
    return (
        <div className='w-100%'>
            <p className='text-center pb-4 font-medium tracking-tighter text-black dark:text-white'>Original
                Image</p>
            <AspectRatio>
                <Image src={URL.createObjectURL(file)} alt="Image" fill='contain'
                       className="rounded-md object-cover"/>
            </AspectRatio>
        </div>
    );
};
