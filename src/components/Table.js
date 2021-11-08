import React, { Component } from 'react'
import axios from 'axios';
import style from '../styles/table.module.css'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Link } from 'react-router-dom'

import InsertForm from './InsertForm.js'
import UpdateForm from './UpdateForm.js'
import ListGrid from './ListGrid.js'


export default class Table extends Component {

    state = {
        tables: [],
        valueTable: null,
        propertiesColumnList: null
    }

    componentDidMount() {
        axios.get(`http://localhost:8080/sakila/showTables`)
        .then(res => {
            const tables = res.data;
            this.setState({ tables, valueTable: tables[0]});
            
            axios.get("http://localhost:8080/" + tables[0] + "/describe")
            .then(res => {
                this.setState({propertiesColumnList:  JSON.stringify(res.data.slice(1, res.data.length))})
            })
        })  
        
    }

    
    _handleChange = (event) => {
        this.setState({valueTable: event.target.value})
        
        axios.get("http://localhost:8080/" + event.target.value + "/describe")
            .then(res => {
                this.setState({propertiesColumnList:  JSON.stringify(res.data.slice(1, res.data.length))})
            
            })

    }

    render() {
        return (
            <>
            <Router>

            <div className={style.ul}>
                    <Link className={style.li} to="/list">
                        List
                    </Link>
                    <Link className={style.li} to="/insert">
                        Insert
                    </Link>
                    <Link className={style.li} to="/update">
                        Update
                    </Link>
            </div>

            <select id="selezioneTabella" onChange={this._handleChange} className={style.selectContainer} ref={ref => this._select = ref}>
                {this.state.tables.map(tables => <option value={tables}>{tables}</option>)}
            </select>

                <Switch>
                    <Route path="/list">
                        <ListGrid key={this.state.valueTable} valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
                    </Route>

                    <Route path="/insert">
                        <InsertForm key={this.state.valueTable} valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
                    </Route>

                    <Route path="/update">
                        <UpdateForm key={this.state.valueTable} valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
                    </Route>
                </Switch>
                
            </Router>
            
            
            </>
        )
    }
    
}

