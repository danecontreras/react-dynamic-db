import React from 'react'
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
    index: state.linkPersist.index,
    linkList: state.linkPersist.linkList
  }
}

export default connect(
  mapStateToProps
)(PersistContainer)
