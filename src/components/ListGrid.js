import React, { Component } from 'react'
import axios from 'axios'
import style from '../styles/gridList.module.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default class ListGrid extends Component {
    constructor(props){
        super(props)
        this.state = {
            gridList: [],
            pageValue: 12,
            rowNumbers: 0,
            result: []
            
        }      
    }

    async componentDidMount(){
        axios.get("http://localhost:8080/" + this.props.valueTable + "/" + this.props.valueTable + "List")
            .then(res => {
                let result = res.data;
                this.setState({result})
                let gridList = []
                console.log(result)
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

    onPageInputKeyDown(event, options) {
        if (event.key === 'Enter') {
            const page = parseInt(this.state.currentPage);
            if (page < 0 || page > options.totalPages) {
                this.setState({ pageInputTooltip: `Value must be between 1 and ${options.totalPages}.`})
            }
            else {
                const first = this.state.currentPage ? options.rows * (page - 1) : 0;

                this.setState({ first1: first, pageInputTooltip: 'Press \'Enter\' key to go to this page.' });
            }
        }
    }

    onPageInputChange(event) {
        this.setState({ currentPage: event.target.value });
    }

    render() {
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
        
        return (    
            <>  
                <Router>
                    <div className={style.buttonGrid}>
                        <Link className={style.nextButton} to="/htmlTable" >HTML</Link>
                        <Link className={style.nextButton} to="/primeReactTable">Prime React</Link>
                    </div>
                    <Switch>   
                        <div className={style.mainContainer}>
                            <Route path="/primeReactTable">
                                <div className={style.container}>
                                    <DataTable className={style.dataTable} value={this.state.result} paginator responsiveLayout="scroll"
                                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                                            paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                            { JSON.parse(this.props.propertiesColumnList).map(propertiesColumn => <Column field={propertiesColumn.name} header={propertiesColumn.name}></Column>) }
                                    </DataTable>
                                </div>
                            </Route>
                            <Route path="/htmlTable">
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
                                <div className={style.buttonGrid}>
                                    <button className={style.prevButton} onClick={(e) => this.prevRows(this.state.rowNumbers)}>PREV PAGE</button>
                                    <button className={style.nextButton} onClick={(e) => this.nextRows(this.state.rowNumbers)}>NEXT PAGE</button>
                                </div>
                            </Route>
                        </div>
                    </Switch>
                </Router>
                
                
                
            </>
        )
    }
}
