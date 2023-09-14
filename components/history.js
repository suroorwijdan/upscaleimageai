import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {memo, useEffect, useState} from "react";
import {GenerationHistoryRow} from "@/components/generation-history-row";

function History({onView}) {
    const supabase = createClientComponentClient();
    const [generationHistory, setGenerationHistory] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await getGenerationHistory();
            setGenerationHistory(data);
        })();
    }, [])

    const getGenerationHistory = async () => {
        const {data, error} = await supabase.from('generations').select().order('created_at', {ascending: false});
        return data;
    }

    return (
        <Card className=''>
            <CardHeader>
                <CardTitle>History</CardTitle>
                <CardDescription>
                    You can find your previous upscaled images here
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100vh-300px)] overflow-y-scroll items-start">
                {generationHistory.map((data) => <GenerationHistoryRow key={data.id} data={data} onView={onView}/>)}
            </CardContent>
        </Card>
    )
}

export const GenerationHistory = memo(History);
