"use client";

import {Button} from "@/components/ui/button";
import {DownloadIcon} from "@radix-ui/react-icons";

export const DownloadButton = ({fileURL, disabled}) => {
    const handleDownload = async () => {
        try {
            const result = await fetch(fileURL, {
                method: "GET",
            });
            const blob = await result.blob();
            const url = URL.createObjectURL(blob);
            initDownload("upscaled-image", url);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    const initDownload = (filename, content) => {
        const element = document.createElement("a");
        element.setAttribute("href", content);
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };


    return (
        <Button size='sm' onClick={handleDownload} disabled={disabled}>
            <DownloadIcon className='mr-2'/> Download
        </Button>
    );
};
