// the initial state
// contains usually all the default/empty values
const initialState = {
    allColors: [],
};

// redux action
// it takes some params
// returns an object with 2 entries: type (string), payload (object)
export function receiveColors(colors) {
    return {
        type: "colors/receive",
        payload: { colors },
    };
}

// the reducer is a function
// takes the old state and the incoming action
// and returns the new state
export default function reducer(state = initialState, action) {
    // check if the incoming action interests this reducer
    if (action.type === "colors/receive") {
        return {
            ...state, // keep the existing state intact
            allColors: action.payload.colors,
        };
    }
    // default case - no action intercepted
    return state;
}
