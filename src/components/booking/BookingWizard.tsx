import { useReducer, useEffect, useState } from "react";
import type { BookingState, BookingAction, Barber } from "./types";
import { getBarbers } from "./lib/api";
import StepIndicator from "./ui/StepIndicator";
import BarberSelect from "./steps/BarberSelect";
import DateSelect from "./steps/DateSelect";
import TimeSelect from "./steps/TimeSelect";
import ClientForm from "./steps/ClientForm";
import Confirmation from "./steps/Confirmation";

const initialState: BookingState = {
  step: 1,
  barberId: null,
  date: null,
  time: null,
  clientName: "",
  clientPhone: "",
};

function reducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SELECT_BARBER":
      return { ...state, barberId: action.barberId, step: 2 };
    case "SELECT_DATE":
      return { ...state, date: action.date, step: 3 };
    case "SELECT_TIME":
      return { ...state, time: action.time, step: 4 };
    case "SET_CLIENT_NAME":
      return { ...state, clientName: action.name };
    case "SET_CLIENT_PHONE":
      return { ...state, clientPhone: action.phone };
    case "CONFIRM":
      return { ...state, step: 5 };
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

  useEffect(() => {
    getBarbers().then(setBarbers);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator currentStep={state.step} />

      <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-800/40 rounded-xl border border-neutral-700/60 backdrop-blur-sm p-6 sm:p-8 shadow-lg shadow-black/20">
        {state.step === 1 && (
          <BarberSelect
            selectedId={state.barberId}
            onSelect={(id) => dispatch({ type: "SELECT_BARBER", barberId: id })}
          />
        )}

        {state.step === 2 && state.barberId && (
          <DateSelect
            barberId={state.barberId}
            selectedDate={state.date}
            onSelect={(date) => dispatch({ type: "SELECT_DATE", date })}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: 1 })}
          />
        )}

        {state.step === 3 && state.barberId && state.date && (
          <TimeSelect
            barberId={state.barberId}
            date={state.date}
            selectedTime={state.time}
            onSelect={(time) => dispatch({ type: "SELECT_TIME", time })}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: 2 })}
          />
        )}

        {state.step === 4 && (
          <ClientForm
            name={state.clientName}
            phone={state.clientPhone}
            onChangeName={(name) => dispatch({ type: "SET_CLIENT_NAME", name })}
            onChangePhone={(phone) => dispatch({ type: "SET_CLIENT_PHONE", phone })}
            onSubmit={() => dispatch({ type: "CONFIRM" })}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: 3 })}
          />
        )}

        {state.step === 5 && (
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
