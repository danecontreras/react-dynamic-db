const initialState = {
    number: 10
};
  
  const persistExampleReducer = (state = initialState, action) => {

    switch (action.type) {
      case "INCREMENT":
        return {
          ...state,
          number: state.number + action.payload
        };
  
      case "RESET":
        return initialState;
  
      default:
        return state;
    }
  };
  
  export default persistExampleReducer
  