import React, { Component } from 'react'
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

export default class Table extends Component {
    
    state = {
        tables: [],
        valueTable: null,
        propertiesColumnList: null,
        propertiesColumnListWithId: null
    }

    componentDidMount() {
        axios.get(`http://localhost:8080/sakila/showTables`)
        .then(res => {
            const tables = res.data;
            this.setState({ tables, valueTable: tables[0]});
            
            axios.get("http://localhost:8080/" + tables[0] + "/describe")
            .then(res => {
                this.setState({propertiesColumnList:  JSON.stringify(res.data.slice(1, res.data.length))})
                this.setState({propertiesColumnListWithId: JSON.stringify(res.data)})
            })
        })  
    }

    _handleChange = (event) => {
        this.setState({valueTable: event.target.value})
        
        axios.get("http://localhost:8080/" + event.target.value + "/describe")
            .then(res => {
                this.setState({propertiesColumnList:  JSON.stringify(res.data.slice(1, res.data.length))})
                this.setState({propertiesColumnListWithId: JSON.stringify(res.data)})
            })

    }

    changedFalse(){
        this.setState({changed: false})
    }

    changedTrue(){
        this.setState({changed: true})
    }
      
    render() {
        return (
            <>
            <Router basename={'/sakila-project'}>
                <Navbar bg="light" variant="light" expand={false}>
                        <Navbar.Toggle aria-controls="collapse-navbar-nav" />
                        <Navbar.Brand as={Link} to="/"> SAKILA PROJECT </Navbar.Brand>
                        <Navbar.Offcanvas id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">SAKILA PROJECT</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        <Nav className="me-auto">
                            <NavDropdown title="List" id="collasible-nav-dropdown" show>
                                    <NavDropdown.Item as={Link} to="/list/htmlTable">
                                        HTML Table
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/list/primeReactTable">
                                        PR Data Table
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/list/dataTable">
                                        PR Actor Table
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/list/hooksDataTable">
                                        PR Hooks Actor Table
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link as={Link} to="/insert">
                                    Insert
                                </Nav.Link>
                                <Nav.Link as={Link} to="/update">
                                    Update
                                </Nav.Link>
                                <Nav.Link as={Link} to="/reduxPersistExample">
                                    Redux Persist
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                        </Navbar.Offcanvas>
                </Navbar>

                
                <select id="selezioneTabella" onChange={this._handleChange} className={style.selectContainer} ref={ref => this._select = ref}>
                    {this.state.tables.map(tables => <option value={tables}>{tables}</option>)}
                </select>

                <Switch>
                    <Route path="/list/htmlTable">
                        <HtmlTable key={this.state.valueTable} valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
                    </Route>

                    <Route path="/list/primeReactTable">
                        <DynamicDataTable key={this.state.valueTable}  valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} propertiesColumnListWithId = {this.state.propertiesColumnListWithId} />
                    </Route>

                    <Route path="/insert">
                        <InsertForm key={this.state.valueTable} valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
                    </Route>

                    <Route path="/update">
                        <UpdateForm key={this.state.valueTable} valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
                    </Route>

                    <Route path="/list/dataTable">
                        <DataTableCrudDemo key={this.state.valueTable} valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
                    </Route>

                    <Route path="/list/hooksDataTable">
                        <HooksDataTable key={this.state.valueTable} />
                    </Route>

                    <Route path="/reduxPersistExample">
                        <PersistContainer />
                    </Route>
                </Switch>
            </Router>
            
            </>
        )
    }
    
}

