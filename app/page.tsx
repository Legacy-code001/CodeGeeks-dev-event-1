import EventCard from "./components/EventCard"
import ExploreBtn from "./components/Explorebtn"
import { events } from "./lib/contestant"

const page = () => {
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
          {events.map((event) => (
            <li key={event.title}> <EventCard {...event} /> </li>
          ))}
        </ul>
      </div>
    </div>
  )

}
export default page