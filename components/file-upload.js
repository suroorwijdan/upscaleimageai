"use client";

import {Button} from "@/components/ui/button";
import {useEffect, useRef} from "react";

export const FileUpload = ({onAccepted}) => {
    const inputRef = useRef();
    const acceptedFormats = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    const dropElementRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let files = [];

        if(e.target.files && e.target.files[0]) {
            files = [...e.target.files];
        } else {
            files = [...e.dataTransfer.files];
        }

        if (!files || !files.length) return;

        const file = files[0];

        if (acceptedFormats.indexOf(file.type) === -1) {
            console.log(`Only following file formats are acceptable: png, jpeg, webp`);
            return;
        }

        onAccepted(file);
    };

    useEffect(() => {
        dropElementRef.current.addEventListener('dragover', handleDragOver);
        dropElementRef.current.addEventListener('drop', handleDrop);

        return () => {
            // dropElementRef.current.removeEventListener('dragover', handleDragOver);
            // dropElementRef.current.removeEventListener('drop', handleDrop);
        };
    }, []);

    return (
        <div ref={dropElementRef}
             className='flex flex-col justify-center items-center border border-gray-700 p-20 rounded-l tracking-tighter'>
            <input ref={inputRef} type="file" onChange={handleDrop} className='hidden'/>
            <Button onClick={() => inputRef.current.click()}>
                Upload Image
            </Button>
            <p className='mt-5'>or drag and drop image to process</p>
        </div>
    );
};
