const initialState = {
    username: "",
    roles: []
}

const jwtTokenReducer = (state = initialState, action) => {

    switch (action.type) {
      case "GET_TOKEN":
        return{
            ...state,
            username: action.payload.sub,
            roles: action.payload.roles
          }
        
      case "RESET":
        return initialState
  
      default:
        return state;
    }
  };
  
  export default jwtTokenReducer
