import React, {useState} from 'react'
import { connect } from 'react-redux'
import { incrementNumber, reset, prevLink, nextLink} from '../redux'

function PersistContainer ({number, incrementNumber, reset, link, prevLink, nextLink}) {
  

  return (
    <div>
      
      <h3>Link - {link}</h3>
      <button onClick = {prevLink}>Previous</button>
      <button onClick = {nextLink}>Next</button>
    </div>
  )
  
}

const mapStateToProps = state => {
  return {
    number: state.persistExample.number,
    link: state.linkPersist.link
  }
}

const mapDispatchToProps = dispatch => {
  return {
    incrementNumber: () => dispatch(incrementNumber()),
    reset: () => dispatch(reset()),
    prevLink: () => dispatch(prevLink()),
    // TODO: SOSTITUIRE LA STRINGA CON UNO STATE O PROP DINAMICO
    nextLink: () => dispatch(nextLink("/ciao"))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersistContainer)
