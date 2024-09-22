import React, { Component, ReactNode } from "react";

// Mock defintion of type Participant
type Participant = {
  id: number;
  name: string;
  email: string;
  allocation: number;
  dateAdded: string;
  budgetStatus: "onTrack" | "behind";
};

// Mock definition of type Group
type Group = {
  name: string;
  totalExpenses: number;
  createdAt: string;
  participants: Participant[];
  user: {
    id: number;
    name: string;
    dateAdded: string;
    allocation: number;
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
  createdAt: "2024-09-22",
  participants: [
    {
      id: 1,
      name: "Aaron",
      email: "aaron@example.com",
      allocation: 250,
      dateAdded: "2024-09-22",
      budgetStatus: "onTrack",
    },
    {
      id: 2,
      name: "Bran",
      email: "bran@example.com",
      allocation: 250,
      dateAdded: "2024-09-22",
      budgetStatus: "behind",
    },
    {
      id: 3,
      name: "Cassy",
      email: "cassy@example.com",
      allocation: 250,
      dateAdded: "2024-09-22",
      budgetStatus: "onTrack",
    },
    {
      id: 4,
      name: "Diana",
      email: "diana@example.com",
      allocation: 250,
      dateAdded: "2024-09-22",
      budgetStatus: "behind",
    },
  ],
  admin: {
    id: 1,
    name: "Aaron",
  },
  user: {
    id: 1,
    name: "Aaron",
    dateAdded: "2024-09-22",
    allocation: 250,
  },
};

class ParticipantsList extends Component<{}> {
  state = {
    participants: [] as Participant[],
  };

  componentDidMount(): void {
    const participants = groupData.participants;
    this.setState({ participants });
  }

  render(): ReactNode {
    const { participants } = this.state;
    console.log(participants);

    return (
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
                    <span className="badge badge--small badge--accent">
                      You
                    </span>
                  </div>
                  <span className="badge badge--accent">
                    {participant.email}
                  </span>
                </div>
                <div className="media__text">
                  <div>
                    <span className="text">${participant.allocation}</span>
                    <span className="badge badge--small badge--primary">
                      {participant.budgetStatus}
                    </span>
                  </div>
                  <span className="date">{participant.dateAdded}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default ParticipantsList;
