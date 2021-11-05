import React, { Component } from 'react'
import axios from 'axios'
import style from '../styles/gridList.module.css'

export default class ListGrid extends Component {
    constructor(props){
        super(props)
        this.state = {
            gridList: [],
            pageValue: 12,
            rowNumbers: 0
            
        }      
    }

    async componentDidMount(){
        axios.get("http://localhost:8080/" + this.props.valueTable + "/" + this.props.valueTable + "List")
            .then(res => {
                let result = res.data;
                let gridList = []

                for(let i=0; i<result.length; i++){
                    gridList.push(JSON.stringify(result[i]))
                }
                
                this.setState({gridList})
            })
        this.setState({rowNumbers: this.state.pageValue})
    }
    
    pagination(rowNumbers){
        return (
            this.state.gridList.slice(rowNumbers-this.state.pageValue, rowNumbers).map(record => 
                <tr id="record">
                    { 
                        JSON.parse(this.props.propertiesColumnList).map(propertiesColumn =>
                            <td>{JSON.parse(record)[propertiesColumn.name]}</td>
                    )}  
                </tr>)
        )
    }

    prevRows(rowNumbers){
        if(rowNumbers !== 12)
            this.setState({rowNumbers: rowNumbers - this.state.pageValue})
    }

    nextRows(rowNumbers){  
        if(rowNumbers < this.state.gridList.length)
        this.setState({rowNumbers: rowNumbers + this.state.pageValue})
    }

    render() {
        return (    
            <>  
                <div className={style.mainContainer}>
                    <div className={style.container}>
                        <table id="table" className={style.table}>
                            <tr className={style.header}>
                                {   
                                    JSON.parse(this.props.propertiesColumnList).map(propertiesColumn => 
                                        <th>{propertiesColumn.name}</th>
                                    )
                                }
                            </tr>
                            {this.pagination(this.state.rowNumbers)}
                        </table>
                    </div>
                </div>
                <div className={style.buttonGrid}>
                    <button className={style.prevButton} onClick={(e) => this.prevRows(this.state.rowNumbers)}>PREV PAGE</button>
                    <button className={style.nextButton} onClick={(e) => this.nextRows(this.state.rowNumbers)}>NEXT PAGE</button>
                </div>
            </>
        )
    }
}
