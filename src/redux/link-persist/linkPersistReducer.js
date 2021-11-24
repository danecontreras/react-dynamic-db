const initialState = {
    index: -1,
    link: "/sakila-project",
    linkList: []
}
  
  const linkPersistReducer = (state = initialState, action) => {

    switch (action.type) {
      case "PREV_LINK":
        if(state.index > 0)
          return {
            ...state,
            index: state.index - 1
          }
        else
          return {
            ...state
          }
      case "NEXT_LINK":
        if(state.index < state.linkList.length - 1)
          return{
            ...state,
            index: state.index + 1
          }
        else
          return{
            ...state
          }
      case "NEW_LINK":
        if(state.link !== action.payload)
          return{
            ...state,
            index: state.index + 1,
            link: action.payload,
            linkList: state.linkList.concat(action.payload)
          }
        else
          return{
            ...state
          }
          
            
      case "RESET":
        return initialState
  
      default:
        return state;
    }
  };
  
  export default linkPersistReducer
  