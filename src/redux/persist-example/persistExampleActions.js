export const incrementNumber = (number = 1) => {
    return {
      type: "INCREMENT",
      payload: number
    }
}

export const reset = () => {
    return {
        type: "RESET"
    }

}
