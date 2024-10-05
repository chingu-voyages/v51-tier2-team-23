import React, { Component } from "react";
import ParticipantsList from "./participantslist";
import SortButton from "./sortButton";
import Header from "./header";
import Button from "./button";

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

class GroupDetails extends Component<{}> {
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

  render() {
    const { name, createdAt, totalExpenses } = groupData;
    const { participants, admin, sortOption } = this.state;
    return (
      <>
        <Header
          name={name}
          date={createdAt.toLocaleDateString()}
          onButtonClick={() => {}}
          totalExpenses={totalExpenses}
          numberOfParticipants={participants.length}
        />
        <SortButton onChange={this.handleSort} value={sortOption} />
        <ParticipantsList
          participants={participants}
          admin={admin}
          budgetStatus={this.renderBudgetStatus}
          budgetStatusBadge={this.renderBudgetStatusBadge}
        />
        <div className="footer">
          <Button
            name="Add Participant"
            onButtonClick={() => {}}
            className="btn"
          />
          <Button
            name="Settle up"
            onButtonClick={() => {}}
            className="btn btn--primary"
          />
        </div>
      </>
    );
  }
}

export default GroupDetails;
