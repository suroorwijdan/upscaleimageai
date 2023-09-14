import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import * as dayjs from 'dayjs';
import {useEffect, useState} from "react";


export function GenerationHistoryRow({data, onView}) {
    const [signedURL, setSignedURL] = useState('');
    const supabase = createClientComponentClient();

    useEffect(() => {
        (async () => {
            const {data: response} = await supabase.storage.from('user-images').createSignedUrl(data.original_image_url, 60 * 60);
            setSignedURL(response.signedUrl);
        })();
    });

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-900">
            <div className="flex items-center space-x-4">
                {/*<Avatar>*/}
                {/*    <AvatarImage src={signedURL}/>*/}
                {/*    <AvatarFallback>-</AvatarFallback>*/}
                {/*</Avatar>*/}
                <div>
                    <p className="text-xs mt-1 text-muted-foreground mb-2">{data.generation_id}</p>
                    <div className="text-sm font-medium leading-none">
                        <Badge variant="outline">{data.status}</Badge>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">{dayjs(data.created_at).format('DD/MM/YYYY hh:mm a')}</p>
                </div>
            </div>
            <div>
                <Button variant='outline' size='sm' onClick={() => onView(data)}>View</Button>
            </div>
        </div>
    )
}
