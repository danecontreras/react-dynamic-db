import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import {reset} from '../redux'


function PersistContainer ({linkList, index, dispatch}) {

  return (
    <div>
      <h3>Link List - {linkList} </h3>
      <h3>Link - {linkList[index]} Index - {index}</h3>
      <button onClick = {(e) => dispatch(reset())} >Reset</button>
    </div>
  )
  
}

const mapStateToProps = state => {
  return {
    number: state.persistExample.number,
    index: state.linkPersist.index,
    link: state.linkPersist.link,
    linkList: state.linkPersist.linkList, 
    linkActual: state.linkPersist.linkActual
  }
}

export default connect(
  mapStateToProps
)(PersistContainer)
