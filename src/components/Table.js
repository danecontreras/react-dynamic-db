import React, { Component } from 'react'
import axios from 'axios';
import style from '../styles/table.module.css'
import Insert from './Insert.js'

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
                let result = res.data;
                result = result.slice(1, result.length);

                let pColumnList = [];

                for(let i=0; i<result.length; i++)
                {
                    pColumnList[i] =  '{"name": "'  + result[i].split(',').slice(0,1)[0] +  '", "type": "' +  result[i].split(',').slice(1,2)[0].replace(/[()1234567890]/g, '') + '"}';
                    //console.log(pColumnList[i])
                }
                let myJSON = '{"obj": [' + pColumnList + ']}';
                //let myJSON = '{"obj": [{"name": "first_name", "type": "varchar"}, {"name": "last_name", "type": "varchar"}, {"name": "last_update", "type": "timestamp"}]}';

                this.setState({propertiesColumnList: myJSON})
            })
        })  
        
    }

    
    _handleChange = (event) => {
        this.setState({valueTable: event.target.value})
        
        axios.get("http://localhost:8080/" + event.target.value + "/describe")
            .then(res => {
                let result = res.data;
                result = result.slice(1, result.length);

                let pColumnList = [];

                for(let i=0; i<result.length; i++)
                {
                    pColumnList[i] =  '{"name": "'  + result[i].split(',').slice(0,1)[0] +  '", "type": "' +  result[i].split(',').slice(1,2)[0].replace(/[()1234567890]/g, '') + '"}';
                    //console.log(pColumnList[i])
                }
                let myJSON = '{"obj": [' + pColumnList + ']}';

                this.setState({propertiesColumnList: myJSON})
                
            })
        
    }

    render() {
        return (
            <>
            <select id="selezioneTabella" onChange={this._handleChange} className={style.selectContainer} ref={ref => this._select = ref}>
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
            
            <Insert key={this.state.valueTable} valueTable = {this.state.valueTable} propertiesColumnList = {this.state.propertiesColumnList} />
            
            </>
        )
    }
    
}

