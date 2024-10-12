// src/components/tests__/GroupForm.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GroupForm from "../../../../../../Chingu  Project - 2/v51-tier2-team-23/src/components/GroupForm";

describe("GroupForm", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // render(
    //   <MemoryRouter>
    //     <GroupForm onClose={onCloseMock} />
    //   </MemoryRouter>
    // );
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <GroupForm onClose={onCloseMock} />
      </MemoryRouter>
    );
  };

  test("renders the form", () => {
    renderComponent();

    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/allocated budget/i)).toBeInTheDocument(); // Ensure the label matches your component
    expect(
      screen.getByRole("button", { name: /create group/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("displays error messages for invalid input", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /create group/i }));

    // Check for required field messages
    expect(
      await screen.findByText(/group name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/description is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/budget is required/i)).toBeInTheDocument();
  });

  test("creates a new group on valid input", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/group name/i), {
      target: { value: "My Group" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Group Description" },
    });
    fireEvent.change(screen.getByLabelText(/allocated budget/i), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create group/i }));

    // Wait for notification to appear
    expect(
      await screen.findByText(/group created successfully/i)
    ).toBeInTheDocument();

    // Check if onClose is called after 3 seconds
    await waitFor(() => expect(onCloseMock).toHaveBeenCalled(), {
      timeout: 4000,
    });
  });

  test("closes the form when Cancel is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
