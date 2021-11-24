import React, {useState, useEffect} from 'react'
import axios from 'axios';
import style from '../styles/table.module.css'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Link } from 'react-router-dom'

import InsertForm from './InsertForm.js'
import UpdateForm from './UpdateForm.js'
import HtmlTable from './HtmlTable.js'
import DataTableCrudDemo from './DataTableCrudDemo.js'
import DynamicDataTable from './DynamicDataTable.js'
import HooksDataTable from './HooksDataTable.js'
import PersistContainer from './PersistContainer.js'

import {Navbar, Nav, NavDropdown, Offcanvas} from 'react-bootstrap'

import { connect } from 'react-redux'

import leftArrow from '../images/left-arrow.png'
import rightArrow from '../images/right-arrow.png'

function Table({dispatch, newLink, nextLink, prevLink, linkList, index}) {
    
    const [tables, setTables] = useState([])
    const [valueTable, setValueTable] = useState(null)
    const [propertiesColumnList, setPropertiesColumnList] = useState(null)
    const [propertiesColumnListWithId, setPropertiesColumnListWithId] = useState(null)


    useEffect(() => {
        axios.get(`http://localhost:8080/sakila/showTables`)
        .then(res => {
            setTables(res.data[0])
            setValueTable(res.data[0])
            
            axios.get("http://localhost:8080/" + res.data[0] + "/describe")
            .then(res => {
                setPropertiesColumnList(JSON.stringify(res.data.slice(1, res.data.length)))
                setPropertiesColumnListWithId(JSON.stringify(res.data))
            })
        })
    }, []);

    const _handleChange = (event) => {
        setValueTable(event.target.value)
        
        axios.get("http://localhost:8080/" + event.target.value + "/describe")
            .then(res => {
                setPropertiesColumnList(JSON.stringify(res.data.slice(1, res.data.length)))
                setPropertiesColumnListWithId(JSON.stringify(res.data))
            })

    }
      
    return (
        <>
        <Router basename={'/sakila-project'}>
            <Navbar bg="light" variant="light" expand={false}>
                    <Navbar.Toggle aria-controls="collapse-navbar-nav" />
                    <Navbar.Brand as={Link} to="/" onClick={() => dispatch(newLink("/"))}> SAKILA PROJECT </Navbar.Brand>
                    <Navbar.Offcanvas id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" placement="start">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">SAKILA PROJECT</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    <Nav className="me-auto">
                        <NavDropdown title="List" id="collasible-nav-dropdown" show>
                                <NavDropdown.Item as={Link} to="/list/htmlTable" onClick={() => dispatch(newLink("/list/htmlTable"))}>
                                    HTML Table
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/list/primeReactTable" onClick={() => dispatch(newLink("/list/primeReactTable"))}>
                                    PR Data Table
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/list/dataTable" onClick={() => dispatch(newLink("/list/dataTable"))}>
                                    PR Actor Table
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/list/hooksDataTable" onClick={() => dispatch(newLink("/list/hooksDataTable"))}>
                                    PR Hooks Actor Table
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={Link} to="/insert" onClick={() => dispatch(newLink("/insert"))}>
                                Insert
                            </Nav.Link>
                            <Nav.Link as={Link} to="/update" onClick={() => dispatch(newLink("/update"))}>
                                Update
                            </Nav.Link>
                            <Nav.Link as={Link} to="/reduxPersistExample" onClick={() => dispatch(newLink("/reduxPersistExample"))}>
                                Redux Persist
                            </Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                    </Navbar.Offcanvas>
            </Navbar>
            
            <Link className={style.backButton} to={linkList[index]} onClick={() => dispatch(prevLink())}>
                <img className={style.arrow} src={leftArrow} width="30" height="30"/>
                <p className={style.backButtonText}>Prev</p>
            </Link>
            <Link className={style.forwardButton} to={linkList[index]} onClick={() => dispatch(nextLink())}>
                <img className={style.arrow} src={rightArrow} width="30" height="30"/>
                <p className={style.forwardButtonText}>Next</p>
            </Link>
        

            <select id="selezioneTabella" onChange={_handleChange} className={style.selectContainer}>
                {tables.map(tables => <option value={tables}>{tables}</option>)}
            </select>

            <Switch>
                <Route path="/list/htmlTable">
                    <HtmlTable key={valueTable} valueTable = {valueTable} propertiesColumnList = {propertiesColumnList} />
                </Route>

                <Route path="/list/primeReactTable">
                    <DynamicDataTable key={valueTable}  valueTable = {valueTable} propertiesColumnList = {propertiesColumnList} propertiesColumnListWithId = {propertiesColumnListWithId} />
                </Route>

                <Route path="/insert">
                    <InsertForm key={valueTable} valueTable = {valueTable} propertiesColumnList = {propertiesColumnList} />
                </Route>

                <Route path="/update">
                    <UpdateForm key={valueTable} valueTable = {valueTable} propertiesColumnList = {propertiesColumnList} />
                </Route>

                <Route path="/list/dataTable">
                    <DataTableCrudDemo key={valueTable} valueTable = {valueTable} propertiesColumnList = {propertiesColumnList} />
                </Route>

                <Route path="/list/hooksDataTable">
                    <HooksDataTable key={valueTable} />
                </Route>

                <Route path="/reduxPersistExample">
                    <PersistContainer />
                </Route>
            </Switch>
        </Router>
        
        </>
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
  )(Table)