export const getToken = (token) => {
    return {
      type: "GET_TOKEN",
      payload: token
    }
}

export const reset = () => {
    return {
        type: "RESET"
    }
}
