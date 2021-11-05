import React, { Component } from 'react'
import axios from 'axios'
import style from '../styles/gridList.module.css'

export default class ListGrid extends Component {
    constructor(props){
        super(props)
        this.state = {
            gridList: []
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
    }

    render() {
        return (    
            <>  
                <div className={style.mainContainer}>
                    <div className={style.container}>
                        <table className={style.table}>
                            <tr>
                                {   
                                    JSON.parse(this.props.propertiesColumnList).map(propertiesColumn => 
                                        <th>{propertiesColumn.name}</th>
                                    )
                                }
                            </tr>
                            {
                                this.state.gridList.map(record => 
                                    <tr>
                                        { 
                                            JSON.parse(this.props.propertiesColumnList).map(propertiesColumn =>
                                                <td>{JSON.parse(record)[propertiesColumn.name]}</td>
                                        )}  
                                    </tr>
                            )}
                        </table>
                    </div>
                </div>
            </>
        )
    }
}
