import React, { Component, ReactNode } from "react";
import SortButton from "./sortButton";

// Mock defintion of type Participant
type Participant = {
  id: number;
  name: string;
  email: string;
  allocation: number;
  contribution: number;
  dateAdded: Date;
  numberOfExpenses: number;
};

// Mock definition of type Group
type Group = {
  name: string;
  totalExpenses: number;
  createdAt: Date;
  numberOfExpenses: number;
  participants: Participant[];
  user: {
    id: number;
    name: string;
    dateAdded: Date;
    allocation: number;
    contribution: number;
  };
  admin: {
    id: number;
    name: string;
  };
};

// Mock Data
const groupData: Group = {
  name: "New Zealand Trip",
  totalExpenses: 1000,
  createdAt: new Date("2024-09-22"),
  numberOfExpenses: 4,
  participants: [
    {
      id: 1,
      name: "Bran",
      email: "bran@example.com",
      allocation: 250,
      contribution: 300,
      dateAdded: new Date("2024-09-15"),
      numberOfExpenses: 2,
    },
    {
      id: 2,
      name: "Aaron",
      email: "aaron@example.com",
      allocation: 500,
      contribution: 300,
      dateAdded: new Date("2024-09-26"),
      numberOfExpenses: 1,
    },

    {
      id: 3,
      name: "Hassy",
      email: "cassy@example.com",
      allocation: 700,
      contribution: 100,
      dateAdded: new Date("2024-09-22"),
      numberOfExpenses: 2,
    },
    {
      id: 4,
      name: "Diana",
      email: "diana@example.com",
      allocation: 900,
      contribution: 250,
      dateAdded: new Date("2024-09-12"),
      numberOfExpenses: 3,
    },
  ],
  admin: {
    id: 1,
    name: "Aaron",
  },
  user: {
    id: 1,
    name: "Aaron",
    dateAdded: new Date("2024-09-22"),
    allocation: 250,
    contribution: 100,
  },
};

class ParticipantsList extends Component<{}> {
  state = {
    participants: [] as Participant[],
    admin: {} as Participant,
    sortOption: "name",
  };

  componentDidMount(): void {
    const { participants, admin } = groupData;
    participants.sort((a, b) => a.name.localeCompare(b.name));
    this.setState({ participants, admin });
  }

  renderBudgetStatusBadge = (participant: Participant): string => {
    let status = this.renderBudgetStatus(participant);
    let classname = "badge badge--small";
    if (status === "behind") classname += " badge--primary";
    else classname += " badge--secondary";

    return classname;
  };

  renderBudgetStatus = ({ allocation, contribution }: Participant): string => {
    const value = allocation - contribution;
    if (value <= 0) return "onTrack";
    return "behind";
  };

  handleSort = (sortOption: String) => {
    let sortedParticipants = [...this.state.participants];

    if (sortOption === "budget") {
      sortedParticipants.sort((a, b) => b.allocation - a.allocation);
    } else if (sortOption === "name") {
      sortedParticipants.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "dateAdded") {
      sortedParticipants.sort((a, b) => {
        const dateA = a.dateAdded.getDate();
        const dateB = b.dateAdded.getDate();
        return dateA - dateB;
      });
    }

    this.setState({ participants: sortedParticipants, sortOption });
  };

  render(): ReactNode {
    const { participants, admin, sortOption } = this.state;

    return (
      <>
        <SortButton value={sortOption} onChange={this.handleSort} />
        <ul className="list">
          {participants.map((participant) => (
            <li key={participant.id}>
              <div className="media">
                <img
                  className="media__image"
                  src="https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=1024x1024&w=is&k=20&c=iGtRKCTRSvPVl3eOIpzzse5SvQFfImkV0TZuFh-74ps="
                  alt="PF"
                />
                <div className="media__body">
                  <div className="media__title">
                    <div>
                      <span className="heading">{participant.name}</span>
                      <span
                        className={
                          participant.name === admin.name
                            ? "badge badge--small badge--accent"
                            : ""
                        }
                      >
                        {participant.name === admin.name ? "You" : ""}
                      </span>
                    </div>
                    <span className="badge badge--accent">
                      {participant.email}
                    </span>
                  </div>
                  <div className="media__text">
                    <div>
                      <span className="text">
                        {participant.numberOfExpenses} expenses
                      </span>
                      <span className="text">${participant.allocation}</span>
                      <span
                        className={this.renderBudgetStatusBadge(participant)}
                      >
                        {this.renderBudgetStatus(participant)}
                      </span>
                    </div>
                    <span className="date">
                      {participant.dateAdded.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default ParticipantsList;
