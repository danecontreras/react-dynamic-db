const initialState = {
    prevLink: "/sakila-project",
    link: "/sakila-project"
};
  
  const linkPersistReducer = (state = initialState, action) => {

    switch (action.type) {
      case "PREV_LINK":
        return {
          ...state,
          link: state.prevLink
        };
      case "NEXT_LINK":
          return{
              ...state,
              prevLink: state.link,
              link: action.payload
          }
      case "RESET":
        return {
            ...state,
            prevLink: state.link,
            link: initialState.link
        };
  
      default:
        return state;
    }
  };
  
  export default linkPersistReducer
  