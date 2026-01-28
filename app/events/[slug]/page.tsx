// "use client"

import { notFound } from "next/navigation"
import Image from "next/image";
import BookEvent from "@/app/components/bookEvent";
import { getSimilerEventBySlug } from "@/app/lib/actions/event.action";
import EventCard from "@/app/components/EventCard";
 
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailedItem = ({icon, alt, label}: {icon: string; alt: string; label: string}) => (

    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p className="text-lg">{label}</p> 
    </div>
    
)

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
    <div className="">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((items) => (
                <li key={items}>{items}</li>
            ))}
        </ul>
    </div>
    
)




const EventTags = ({tags} : {tags: string[]}) => (
    <div className="flex fle-row gap-1.5">
        {
            tags.map((tag) => (
                <div className="pill" key={tag}>{tag}</div>
            ))
        }
    </div>
)


const eventDetailPage = async ({ params }: {params: Promise<{slug: string}>}) => {
    const { slug } = await params;
    const  request = await fetch(`${BASE_URL}/api/events/${slug}`);

    const {event: {description, image, title, overview, date, time, location, mode, agenda, audience, organizer,   tags}} = await request.json()

    if(!description) return notFound()

        const bookings = 10;

        const similarEvents: Event[] = await getSimilerEventBySlug(slug)
        // console.log(similarEvents)
        // console.log(bookings)
    return (

        <div className="" id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p className="mt-2">{description}</p>
            </div>

            <div className="details">
                {/* event contents */}
                <div className="content">
                    <Image src={image} alt="Event Banner" height={800} width={800} className="banner" />
                    <div className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </div>
                    <div>
                        <h2>Event Details</h2>

                        <EventDetailedItem icon="/icons/calendar.svg" alt="calender" label={date} />
                        <EventDetailedItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailedItem icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailedItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailedItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </div>
                    {/* <EventAgenda agenda={JSON.parse(agenda[0])}/> */}

                    
                    <EventAgenda agendaItems={JSON.parse(agenda[0])}/>
                    <section className="flex-col-gap-2">
                        <h2>Orgnizser</h2>
                        <div>{organizer}</div>
                    </section>
                    <EventTags tags={ JSON.parse(tags[0]) }/>
                </div>
                {/* form */}
                <div className="booking">
                    <div className="signup-card">
                         <p className="text-lg font-semibold">Book Your Spot</p>
                        <div>
                            {
                                bookings > 0 ? (
                                    <p className="text-sm">
                                        join {bookings} people who have already book their spot
                                    </p>
                                ): (
                                    <p className="text-sm">Be the first to book your spot!</p>
                                )
                            }
                        </div>
                        <BookEvent />
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {
                        similarEvents.length > 0 &&  similarEvents.map((similarEvents: Event) => (
                            <EventCard key={similarEvents.title} {...similarEvents} />
                        ))
                    }
                </div>

            </div>
        </div> 

    
    )

}
export default eventDetailPage; 