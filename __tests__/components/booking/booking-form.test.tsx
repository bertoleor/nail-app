import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BookingForm } from "@/components/booking/booking-form";
import { useBookingStore } from "@/stores/booking-store";

const mockAddBooking = vi.fn();

describe("BookingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBookingStore.setState({
      currentDate: new Date(2025, 0, 15),
      selectedDate: "2025-01-15",
      bookings: [],
      addBooking: mockAddBooking,
    });
  });

  it("renders trigger button", () => {
    render(<BookingForm />);

    expect(screen.getByRole("button", { name: /nuevo turno/i })).toBeInTheDocument();
  });

  it("opens dialog on click", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has form fields in dialog", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    expect(screen.getByPlaceholderText("Nombre de la clienta")).toBeInTheDocument();
  });

  it("can type in client name field", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const clientInput = screen.getByPlaceholderText("Nombre de la clienta");
    await user.type(clientInput, "Test Client");

    expect(clientInput).toHaveValue("Test Client");
  });

  it("displays selected date in dialog", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    expect(screen.getByText(/fecha:/i)).toBeInTheDocument();
  });

  it("does not display date when no date selected", async () => {
    useBookingStore.setState({
      currentDate: new Date(2025, 0, 15),
      selectedDate: null,
      bookings: [],
      addBooking: mockAddBooking,
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    expect(screen.queryByText(/fecha:/i)).not.toBeInTheDocument();
  });

  it("shows validation error for empty client name on form submit", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const form = screen.getByRole("dialog").querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Ingresá el nombre")).toBeInTheDocument();
    });
  });

  it("shows validation error when no service selected", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const clientInput = screen.getByPlaceholderText("Nombre de la clienta");
    await user.type(clientInput, "Test Client");

    const form = screen.getByRole("dialog").querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      const errorMessages = screen.getAllByText("Seleccioná un servicio");
      expect(errorMessages.some(el => el.className.includes("text-red-500"))).toBe(true);
    });
  });

  it("shows validation error when no time selected", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const clientInput = screen.getByPlaceholderText("Nombre de la clienta");
    await user.type(clientInput, "Test Client");

    const hiddenSelect = screen.getByRole("combobox").parentElement?.querySelector("select[name='serviceId']") as HTMLSelectElement;
    fireEvent.change(hiddenSelect, { target: { value: "manicura" } });

    const form = screen.getByRole("dialog").querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Seleccioná un horario")).toBeInTheDocument();
    });
  });

  it("handles missing date in validation", async () => {
    useBookingStore.setState({
      currentDate: new Date(2025, 0, 15),
      selectedDate: null,
      bookings: [],
      addBooking: mockAddBooking,
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    expect(screen.queryByText(/fecha:/i)).not.toBeInTheDocument();
  });

  it("shows error when submitting without selected date", async () => {
    useBookingStore.setState({
      currentDate: new Date(2025, 0, 15),
      selectedDate: null,
      bookings: [],
      addBooking: mockAddBooking,
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const clientInput = screen.getByPlaceholderText("Nombre de la clienta");
    await user.type(clientInput, "Test Client");

    const hiddenSelect = screen.getByRole("combobox").parentElement?.querySelector("select[name='serviceId']") as HTMLSelectElement;
    fireEvent.change(hiddenSelect, { target: { value: "manicura" } });

    const timeInput = screen.getByLabelText(/horario/i);
    await user.type(timeInput, "10:00");

    const form = screen.getByRole("dialog").querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Seleccioná una fecha")).toBeInTheDocument();
    });
  });

  it("shows conflict error when booking overlaps", async () => {
    useBookingStore.setState({
      currentDate: new Date(2025, 0, 15),
      selectedDate: "2025-01-15",
      bookings: [
        {
          id: "existing-booking",
          clientName: "Existing Client",
          serviceId: "manicura",
          date: "2025-01-15",
          startTime: "10:00",
          duration: 60,
        },
      ],
      addBooking: mockAddBooking,
    });

    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const clientInput = screen.getByPlaceholderText("Nombre de la clienta");
    await user.type(clientInput, "Test Client");

    const hiddenSelect = screen.getByRole("combobox").parentElement?.querySelector("select[name='serviceId']") as HTMLSelectElement;
    fireEvent.change(hiddenSelect, { target: { value: "manicura" } });

    const timeInput = screen.getByLabelText(/horario/i);
    await user.type(timeInput, "10:30");

    const form = screen.getByRole("dialog").querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Horario no disponible")).toBeInTheDocument();
    });
  });

  it("submits successfully with valid data", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const clientInput = screen.getByPlaceholderText("Nombre de la clienta");
    await user.type(clientInput, "Test Client");

    const hiddenSelect = screen.getByRole("combobox").parentElement?.querySelector("select[name='serviceId']") as HTMLSelectElement;
    fireEvent.change(hiddenSelect, { target: { value: "manicura" } });

    const timeInput = screen.getByLabelText(/horario/i);
    await user.type(timeInput, "14:00");

    const form = screen.getByRole("dialog").querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockAddBooking).toHaveBeenCalled();
    });
  });

  it("calls addBooking with correct booking data", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const clientInput = screen.getByPlaceholderText("Nombre de la clienta");
    await user.type(clientInput, "María García");

    const hiddenSelect = screen.getByRole("combobox").parentElement?.querySelector("select[name='serviceId']") as HTMLSelectElement;
    fireEvent.change(hiddenSelect, { target: { value: "manicura" } });

    const timeInput = screen.getByLabelText(/horario/i);
    await user.type(timeInput, "14:00");

    const form = screen.getByRole("dialog").querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockAddBooking).toHaveBeenCalledWith(
        expect.objectContaining({
          clientName: "María García",
          serviceId: "manicura",
          date: "2025-01-15",
          startTime: "14:00",
          duration: 60,
        })
      );
    });
  });

  it("closes dialog after successful submission", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await user.click(screen.getByRole("button", { name: /nuevo turno/i }));
    await screen.findByRole("dialog");

    const clientInput = screen.getByPlaceholderText("Nombre de la clienta");
    await user.type(clientInput, "Test Client");

    const hiddenSelect = screen.getByRole("combobox").parentElement?.querySelector("select[name='serviceId']") as HTMLSelectElement;
    fireEvent.change(hiddenSelect, { target: { value: "manicura" } });

    const timeInput = screen.getByLabelText(/horario/i);
    await user.type(timeInput, "11:00");

    const form = screen.getByRole("dialog").querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
