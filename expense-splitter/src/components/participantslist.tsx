import React from "react";

type Participant = {
  id: number;
  name: string;
  email: string;
  allocation: number;
  contribution: number;
  dateAdded: Date;
  numberOfExpenses: number;
};

// interface Participant {
//   name: string;
//   contribution: string;
//   avatarUrl: string;
//   weight: number
// }

interface Props {
  participants: Participant[];
  admin: { id: number; name: string };
  budgetStatus: Function;
  budgetStatusBadge: Function;
}

const ParticipantsList: React.FC<Props> = ({
  participants,
  admin,
  budgetStatus,
  budgetStatusBadge,
}) => {
  return (
    <>
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
                    <span className={budgetStatusBadge(participant)}>
                      {budgetStatus(participant)}
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
};

export default ParticipantsList;
