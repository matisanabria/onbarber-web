import { useReducer, useEffect, useState } from "react";
import type { BookingState, BookingAction, Barber } from "./types";
import { getBarbers, createAppointment } from "./lib/api";
import StepIndicator from "./ui/StepIndicator";
import BarberSelect from "./steps/BarberSelect";
import DateTimeSelect from "./steps/DateTimeSelect";
import ClientForm from "./steps/ClientForm";
import Confirmation from "./steps/Confirmation";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const initialState: BookingState = {
  step: 1,
  barberId: null,
  date: todayStr(),
  time: null,
  clientName: "",
  clientPhone: "",
};

function reducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SELECT_BARBER":
      return { ...state, barberId: action.barberId };
    case "SELECT_DATE":
      return { ...state, date: action.date, time: null };
    case "SELECT_TIME":
      return { ...state, time: action.time, step: 3 };
    case "SET_CLIENT_NAME":
      return { ...state, clientName: action.name };
    case "SET_CLIENT_PHONE":
      return { ...state, clientPhone: action.phone };
    case "CONFIRM":
      return { ...state, step: 4 };
    case "GO_TO_STEP":
      return { ...state, step: action.step };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function BookingWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getBarbers().then(setBarbers);
  }, []);

  async function handleConfirm() {
    if (!state.barberId || !state.date || !state.time) return;

    setSubmitting(true);
    setSubmitError(null);

    const result = await createAppointment(
      state.barberId,
      state.date,
      state.time,
      state.clientName,
      state.clientPhone
    );

    setSubmitting(false);

    if (result.success) {
      dispatch({ type: "CONFIRM" });
    } else {
      setSubmitError(result.error || "Error al reservar");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator currentStep={state.step} />

      <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-800/40 rounded-xl border border-neutral-700/60 backdrop-blur-sm p-4 sm:p-8 shadow-lg shadow-black/20">
        {state.step === 1 && (
          <BarberSelect
            selectedId={state.barberId}
            onSelect={(id) => dispatch({ type: "SELECT_BARBER", barberId: id })}
            onNext={() => dispatch({ type: "GO_TO_STEP", step: 2 })}
          />
        )}

        {state.step === 2 && state.barberId && (
          <DateTimeSelect
            barberId={state.barberId}
            selectedDate={state.date}
            selectedTime={state.time}
            onSelectDate={(date) => dispatch({ type: "SELECT_DATE", date })}
            onSelectTime={(time) => dispatch({ type: "SELECT_TIME", time })}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: 1 })}
          />
        )}

        {state.step === 3 && (
          <ClientForm
            name={state.clientName}
            phone={state.clientPhone}
            onChangeName={(name) => dispatch({ type: "SET_CLIENT_NAME", name })}
            onChangePhone={(phone) => dispatch({ type: "SET_CLIENT_PHONE", phone })}
            onSubmit={handleConfirm}
            submitting={submitting}
            error={submitError}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: 2 })}
          />
        )}

        {state.step === 4 && (
          <Confirmation
            state={state}
            barbers={barbers}
            onReset={() => dispatch({ type: "RESET" })}
          />
        )}
      </div>
    </div>
  );
}
