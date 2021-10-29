import React, { Component } from 'react'
import axios from 'axios';
import style from '../styles/table.module.css'
import Insert from './Insert.js'

export default class Table extends Component {

    state = {
        tables: [],
        valueTable: null,
        propertiesColumnMap: {},
        propertiesColumnList: []
    }

    componentDidMount() {
        axios.get(`http://localhost:8080/sakila/showTables`)
        .then(res => {
            const tables = res.data;
            this.setState({ tables, valueTable: tables[0]});
            
            axios.get("http://localhost:8080/" + tables[0] + "/describe")
            .then(res => {
                let result = res.data;
                result = result.slice(1, result.length);
                
                //let columnNameList = [];
                //let columnTypeList = [];

                let pColumnList = new Array(result.length);
                for(var i=0; i<result.length; i++)
                {
                    pColumnList[i] = {"name" : null,
                    "type": null}
                }

                for(i=0; i<result.length; i++)
                {
                    pColumnList[i] = "{ 'name': " + result[i].split(',').slice(0,1)[0] + ", 'type': " + result[i].split(',').slice(1,2)[0].replace(/1234567890()/g, '') + "}";
                    //pColumnList[i] = result[i].split(',').slice(1,2)[0].replace(/1234567890()/g, '');
                    
                    //pColumnList[i] = propertiesColumnMap;
                    console.log(pColumnList[i])
                }
                
                //propertiesColumnList.forEach(propertiesColumnList => console.log(propertiesColumnList.name))
                //this.setState({ columnNameList });  
                //this.setState({ columnTypeList });  
                this.setState({propertiesColumnList: pColumnList})
            })
        })  
        
    }

    
    _handleChange = (event) => {
        this.setState({valueTable: event.target.value})
        /*
        axios.get("http://localhost:8080/" + event.target.value + "/describe")
            .then(res => {
                let result = res.data;
                result = result.slice(1, result.length);
                
                
            })
        */
    }

    render() {
        return (
            <>
            <select id="selezioneTabella" onChange={this._handleChange} className={style.selectContainer} ref={ref => this._select = ref} defaultValue = {this.state.valueTable}>
                {this.state.tables.map(tables => <option value={tables}>{tables}</option>)}
            </select>

            <div className={style.container}>
                <div className={style.containerList}>
                    List
                </div>
                <div className={style.containerInsert}>
                    Insert
                </div>
                <div className={style.containerUpdate}>
                    Update
                </div>
            </div>
            
            <Insert valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
            
            </>
        )
    }
    
}

