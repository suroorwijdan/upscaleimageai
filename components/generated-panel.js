import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ChevronDownIcon, DownloadIcon} from "@radix-ui/react-icons";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import * as dayjs from 'dayjs';
import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {SelectedImage} from "@/components/selected-image";
import {FileUpload} from "@/components/file-upload";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Icons} from "@/components/icons";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import Image from "next/image";
import {ReactCompareSlider, ReactCompareSliderImage} from "react-compare-slider";
import {ProcessingImage} from "@/components/processing-image";
import {DownloadButton} from "@/components/download-button";


export function GeneratedPanel({data, refresh}) {
    const [signedURL, setSignedURL] = useState('');
    const [generatedSignedURL, setGeneratedSignedURL] = useState('');
    const supabase = createClientComponentClient();
    const [generationResponse, setGenerationResponse] = useState({});

    useEffect(() => {
        fetchStatus();
        fetchSignedURL();
    }, [data]);

    const fetchStatus = async () => {
        const {data: response} = await supabase.from('generations').select().eq('id', data.id).single();

        console.log(response.generated_image_url);
        if (!response.generated_image_url) {
            await new Promise((resolve) => setTimeout(() => resolve(), 2000));
            await fetchStatus();
            return;
        }

        await setGenerationResponse(response);
        await fetchGeneratedSignedURL(response.generated_image_url);
    }

    const fetchSignedURL = async () => {
        const {data: response} = await supabase.storage.from('user-images').createSignedUrl(data.original_image_url, 60 * 60);
        setSignedURL(response.signedUrl);
    }

    const fetchGeneratedSignedURL = async (url) => {
        const {
            data: outputResponse,
            error
        } = await supabase.storage.from('user-images').createSignedUrl(url, 60 * 60);
        setGeneratedSignedURL(outputResponse.signedUrl);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex justify-between'>
                    <p>Generated Image</p>
                </CardTitle>
                <CardDescription>
                    {generatedSignedURL ? `Your image generation is complete and took ${generationResponse.processing_time} seconds` : 'Your image is being generated, please wait.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="generated">
                    <div className='flex justify-between'>
                        <TabsList>
                            <TabsTrigger value="generated">Generated</TabsTrigger>
                            <TabsTrigger value="side_by">Side by Side</TabsTrigger>
                            <TabsTrigger value="comparision">Comparison</TabsTrigger>
                        </TabsList>
                        <div className='flex'>
                            <Button size='sm' variant='outline' className='mr-2' onClick={refresh}
                                    disabled={!generatedSignedURL}> Try new
                                image</Button>
                            <Separator orientation='vertical' className='mr-2'/>
                            <DownloadButton fileURL={generatedSignedURL} disabled={!generatedSignedURL}/>
                        </div>
                    </div>

                    <Separator className='mt-3 mb-3'/>

                    <TabsContent value="generated">
                        <div className='w-100%'>
                            {
                                !generatedSignedURL ? <ProcessingImage/> : <AspectRatio>
                                    <Image
                                        src={generatedSignedURL}
                                        alt="Image" fill='contain' className="rounded-md object-cover"/>
                                </AspectRatio>
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="side_by">
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='col-span-1'>
                                <p className='text-sm text-center pt-4 pb-4 font-medium tracking-tighter text-black dark:text-white'>Original
                                    Image</p>
                                <AspectRatio>
                                    <Image
                                        src={signedURL ? signedURL : ''}
                                        alt="Image" fill='contain' className="rounded-md object-cover"/>
                                </AspectRatio>
                            </div>
                            <div className='col-span-1'>
                                <p className='text-sm text-center pt-4 pb-4 font-medium tracking-tighter text-black dark:text-white'>Generated
                                    Image</p>
                                {
                                    !generatedSignedURL ? <ProcessingImage/> : <AspectRatio>
                                        <Image
                                            src={generatedSignedURL}
                                            alt="Image" fill='contain' className="rounded-md object-cover"/>
                                    </AspectRatio>
                                }
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="comparision">
                        <ReactCompareSlider
                            itemOne={<ReactCompareSliderImage
                                src={signedURL ? signedURL : ''}
                                alt="Original Image"/>}
                            itemTwo={<ReactCompareSliderImage
                                src={generatedSignedURL ? generatedSignedURL : ''}
                                alt="Generated Image"/>}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
