import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Tickets.css"

export const TicketList = () => {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFilteredTickets] = useState([])
    const [emergency, setEmergency] = useState(false)
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
            if (emergency) {
                const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
                setFilteredTickets(emergencyTickets)
            } else {
                setFilteredTickets(tickets)
            }
        },
        [emergency]
    )

    useEffect(
        () => {
            // console.log("Initial state of tickets", tickets) // View the initial state of tickets
            fetch("http://localhost:8088/serviceTickets")
                .then(response => response.json())
                .then((ticketArray) => {
                    setTickets(ticketArray)
                })
        },
        [] // When this array is empty, you are observing initial component state
    )

    useEffect(
        () => {
            if (honeyUserObject.staff) {
                setFilteredTickets(tickets)
            } else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFilteredTickets(myTickets)
            }
        },
        [tickets]
    )

    return <>
        {
            honeyUserObject.staff
                ? <>
                <button onClick={() => {setEmergency(true)}}>Emergency Only</button>
                <button onClick={() => {setEmergency(false)}}>Show All</button>
                </>
                : <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
        }

        <h2>List of Tickets</h2>

        <article className="tickets">
            {
                filteredTickets.map(filteredTicket => {
                    return <>
                    <section className="ticket">
                        <header>${filteredTicket.description}</header>
                        <footer>Emergency: {filteredTicket.emergency ? "🧨" : "No"}</footer>
                    </section>
                    </>
                })
            }
        </article>
    </>
}