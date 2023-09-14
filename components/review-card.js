import {cn} from "@/lib/utils";

export const ReviewCard = ({
                        img,
                        name,
                        username,
                        body,
                    }) => {
    return (
        <figure
            className={cn(
                "relative w-80 h-40 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-300 bg-gray-950/[.01] hover:bg-gray-800/[.05]",
                // dark styles
                "dark:border-gray-800 dark:border-gray-50/[.1]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img}/>
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-black dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-black/40 dark:text-white/50">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-black dark:text-white">{body}</blockquote>
        </figure>
    );
};
