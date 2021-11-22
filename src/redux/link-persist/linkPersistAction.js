export const prevLink = () => {
    return {
      type: "PREV_LINK"
    }
}

export const nextLink = (link) => {
    return {
      type: "NEXT_LINK",
      payload: link
    }
}
export const reset = () => {
    return {
        type: "RESET"
    }

}