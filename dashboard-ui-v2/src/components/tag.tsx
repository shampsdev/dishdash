import { Tag } from "@/interfaces/place.interface"

export const TagComponent = ({ tag, onClick }: { tag: Tag, onClick?: () => void }) => {
    return <div onClick={onClick} className="inline-flex w-fit h-fit text-sm rounded-full cursor-pointer border border-secondary">
        <img className="w-[20px] shrink-0 min-w-[20px] my-1 h-[20px] ml-2 mr-1" src={tag.icon} />
        <p className="my-1 mr-3 text-nowrap">
            {tag.name}
        </p>
    </div>
}
