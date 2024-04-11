interface State{
  booking:boolean;
  settings:boolean;
  schedule:boolean;
}
 type Action =
		| {
				type: 'booking';
		  }
		| {
				type: 'setting';
		  }
		| {
				type: 'schedule';
		  };

export const initialMultipleState: State = {
	booking: false,
	settings: false,
	schedule:false,
};


const multipleReducerState = (state: State, action: Action): State => {
	switch (action.type) {
		case 'booking':
			return { ...state, booking: !state.booking, settings: false,schedule:false };
		case 'setting':
			return { ...state, settings: !state.settings, booking: false,schedule:false };
		case 'schedule':
			return { ...state, schedule: !state.schedule, booking: false,settings:false };

		default:
			return state;
	}
};

export default multipleReducerState;