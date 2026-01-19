import Link from "next/link";
import Image from "next/image";

interface Props {
    title : string,
    image : string,
    location : string,
    slug: string,
    date: string,
    time: string
}
const EventCard = ({image, title, slug, location, date, time} : Props) => {

    return (
        <Link href={`/events/${slug}`} className="poster flex flex-col gap-2">
            <Image src={image} alt={title} width={410} height={300} />

            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
                <p>{location}</p>
            </div>

            <p className="title">{title}</p>

            <div className="datetime text-light-200 flex flex-row  items-center gap-4">
                <div className="flex gap-1">
                    <Image src="icons/calendar.svg" alt="date" width={14} height={14} />
                    <p>{date}</p>
                </div>
                <div className="flex gap-1">
                    <Image src="icons/clock.svg" alt="time" width={14} height={14} />
                    <p>{time}</p>
                </div>
            </div>

            
        </Link>
    )
}
export default EventCard;