export const prevLink = () => {
  return {
    type: "PREV_LINK"
  }
}

export const nextLink = () => {
  return {
    type: "NEXT_LINK"
  }
}

export const newLink = (link) => {
    return {
      type: "NEW_LINK",
      payload: link
    }
}

export const reset = () => {
    return {
        type: "RESET"
    }

}