"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Icons} from "@/components/icons";
import {GenerationHistory} from "@/components/history";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {FileUpload} from "@/components/file-upload";
import {useEffect, useState} from "react";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {SelectedImage} from "@/components/selected-image";
import {v4 as uuidv4} from "uuid";
import {useToast} from "@/components/ui/use-toast";
import {GeneratedPanel} from "@/components/generated-panel";
import Link from "next/link"

export default function DashboardPage() {
    const {toast} = useToast();
    const supabase = createClientComponentClient();
    const [user, setUser] = useState({});
    const [isProcessing, setProcessing] = useState(false);
    const [generationResponse, setGenerationResponse] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [taskType, setTaskType] = useState(null);

    useEffect(() => {
        fetchUserFromSession();
    }, [])

    const fetchUserFromSession = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        if (user) {
            const {data} = await supabase.from('users').select().eq('user_id', user.id).single();
            user.profile = data;
            setUser(user);
        }
    }

    const onImageAdded = async (file) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage({file, preview: reader.result});
        };
        reader.readAsDataURL(file);
    }

    const onTaskTypeChange = (value) => {
        setTaskType(value);
    }

    const onSubmitForProcessing = async () => {
        if (!selectedImage.file) {
            return;
        }

        if (!taskType) {
            return;
        }

        setProcessing(true);

        if (!taskType || !selectedImage.file) {
            return;
        }

        // upload image to supabase storage under user directory
        const fileName = `${uuidv4()}-${selectedImage.file.name}`
        const {data, error} = await supabase
            .storage
            .from('user-images')
            .upload(`${user.id}/${fileName}`, selectedImage.file, {
                cacheControl: '3600',
                upsert: false
            });

        // request processing - calling next api route
        const payload = {
            taskType: taskType,
            originalImage: data.path
        }

        const response = await requestProcessing(payload);
        if (!response || (response && response.code)) {
            toast({
                variant: "destructive",
                title: `Uh oh! ${response.message}`,
                description: `Error code: ${response.code}`,
            })
            setProcessing(false);
            return;
        }

        toast({
            variant: "success",
            title: "Processing started...",
            description: `Wait for a few seconds for scaling to complete`,
        });

        setGenerationResponse(response);
        setProcessing(false);

        // update user credits
        await fetchUserFromSession();
    }

    const requestProcessing = async (payload) => {
        try {
            // send data for processing
            const response = await fetch("/api/process", {
                body: JSON.stringify(payload),
                method: "POST",
            });

            return response.json();
        } catch (e) {
            return null;
        }
    }

    const refreshPanel = () => {
        setProcessing(false);
        setGenerationResponse({});
        setSelectedImage(null);
        setTaskType(null);
    }

    const onView = async (generatedRecord) => {
        setGenerationResponse(generatedRecord);
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-md md:text-3xl font-bold tracking-tighter">Your account</h2>
                <p className='text-sm md:text-md tracking-tighter'>Available credits
                    - {user.profile ? user.profile.credits : 0}</p>
            </div>
            <div className="grid-cols-1 md:grid-cols-3 grid items-start gap-y-6 md:gap-6">
                <div className="col-span-1 hidden md:block">
                    <GenerationHistory onView={onView}/>
                </div>
                <div className='col-span-2'>
                    {generationResponse && generationResponse.id ?
                        <GeneratedPanel data={generationResponse} refresh={refreshPanel}/> : <Card>
                            <CardHeader>
                                <CardTitle>Upscale image</CardTitle>
                                <CardDescription>
                                    <div className='flex justify-between items-center'>
                                        Upload image you want to process and select objective

                                        <Button size='sm' variant=''
                                                className={`mr-2 ${selectedImage ? 'block' : 'hidden'}`}
                                                onClick={refreshPanel}
                                                disabled={!selectedImage}> Choose different image</Button>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {
                                    selectedImage && selectedImage.preview ?
                                        <SelectedImage data={selectedImage}/> :
                                        <FileUpload onAccepted={onImageAdded}/>
                                }

                                <Separator className='mt-5'/>
                                <div className='mt-5 w-full'>
                                    <Label htmlFor="taskType" className='block mb-3'>Select Objective</Label>
                                    <Select id='taskType' className='w-full' onValueChange={onTaskTypeChange}>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Select upscaling type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Image Deblurring (REDS)">Deblur
                                                image</SelectItem>
                                            <SelectItem value="Image Deblurring (GoPro)">Deblur image
                                                (GoPro)</SelectItem>
                                            <SelectItem value="Image Denoising">Remove noise</SelectItem>
                                            <SelectItem value="Stereo Image Super-Resolution">Increase
                                                Resolution
                                                (HD+)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator className='mt-5'/>

                                <div className='flex items-center mt-5'>
                                    {user.profile && user.profile.credits <= 0 ?
                                        <div className='flex items-center'>
                                            <Link href='/account/pricing'>
                                                <Button className=''>
                                                    Buy Credits
                                                </Button>
                                            </Link>
                                            <p className='text-sm text-gray-500 ml-5'>You are out of credits</p>
                                        </div> : <div className='flex items-center'>
                                            <Button className='' onClick={onSubmitForProcessing}
                                                    disabled={!selectedImage || !taskType}>

                                                {
                                                    isProcessing ? <div className='flex items-center'>
                                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                                        Processing...
                                                    </div> : <p> Start processing </p>
                                                }
                                            </Button>
                                            <p className='text-sm text-gray-500 ml-5'>Typically takes 20-35
                                                seconds</p>
                                        </div>}
                                </div>
                            </CardContent>
                        </Card>}
                </div>
            </div>
        </div>
    )
}
