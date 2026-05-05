import { useDashboardStore } from "@/shared/stores/places.store";
import { Plus, X } from "lucide-react";

export const TagsPage = () => {
    const { tags } = useDashboardStore();

    return (
        <div className="w-full h-full flex">
            <div className="flex pt-5 flex-col space-y-5 w-[300px] border-secondary border-r">
                {tags.map((tag) => (
                    <div className="group cursor-pointer flex gap-5 hover:bg-secondary mx-5 items-center py-2 px-4 rounded-full border border-secondary">
                        <div className="w-[30px]">
                            <img className="w-full h-full object-cover" src={tag.icon} />
                        </div>
                        <p>{tag.name}</p>
                        <div className="group-hover:flex ml-auto text-primary hidden items-center justify-center p-1 rounded-md">
                            <X className="h-[20px]" />
                        </div>
                    </div>
                ))}
                <div className="cursor-pointer flex items-center justify-center text-primary hover:bg-secondary mx-5 py-2 px-6 rounded-full border border-secondary">
                    <Plus />
                </div>
            </div>
        </div>
    )
}
