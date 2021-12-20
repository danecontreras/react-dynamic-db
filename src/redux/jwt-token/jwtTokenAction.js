export const getToken = (token) => {
    return {
      type: "GET_TOKEN",
      payload: token
    }
}

export const setToken = (encryptedToken) => {
    return {
      type: "SET_TOKEN",
      payload: encryptedToken
    }
}

export const reset = () => {
    return {
        type: "RESET"
    }
}
