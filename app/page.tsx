import EventCard from "./components/EventCard"
import ExploreBtn from "./components/Explorebtn"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const page = async () => {

  const response = await fetch(`${BASE_URL}/api/events`, {})
  const {events} = await response.json();
  // const events = [
  //   {title: "Event1", image: "/images/event1.png", slug: "slug-1", location: "location-1", date: "Date-1", time: "Time-1"},
  //   {title: "Event2", image: "/images/event2.png"}
  // ]
  return (
    <div>
      <h1 className="text-center">The Hub For Ever Dev  <br /> You Cant Afford To Miss this!!!</h1>
      <p className="text-center mt-5">Hackathon, Meet-up, Confrences. All in one place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events && events.length > 0 && events.map((event: Event) => (
            <li className="list-none" key={event.title}> <EventCard {...event} /> </li>
          ))}
        </ul>
      </div>
    </div>
  )

}
export default page