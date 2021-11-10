import React, { Component } from 'react'
import axios from 'axios'
import style from '../styles/gridList.module.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'; 
import InsertForm from './InsertForm.js'
import { ConnectedOverlayScrollHandler } from 'primereact/utils';

export default class ListGrid extends Component {
    constructor(props){
        super(props)
        this.state = {
            result: [],
            insertDialog: false,
            idName: null,
            record: null
        }     
    }

    componentDidMount(){
        axios.get("http://localhost:8080/" + this.props.valueTable + "/" + this.props.valueTable + "List")
            .then(res => {
                let result = res.data;
                this.setState({result})
                this.setState({idName: JSON.parse(this.props.propertiesColumnListWithId)[0].name})
                
            })
            
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

    hideDialog = () => {
        this.setState({insertDialog: false})
    }

    showDialog = () => {
        this.setState({insertDialog: true})
    }

    getId(id) {
        console.log(id)
    }

    confirmDeleteProduct() {
    }

    deleteProduct() {

    }

    actionBodyTemplate(rowData) {
        console.log(rowData)
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => this.getId(rowData.actor_id)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => this.confirmDeleteProduct} />
            </React.Fragment>
        );
    }

    render() {
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
        return (    
            <>  
                <div className={style.mainContainer}>
                <button className={style.addButton} onClick={this.showDialog}>+ New</button>
                        <div className={style.container}>
                            <DataTable className={style.dataTable} value={this.state.result} paginator responsiveLayout="scroll"
                                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                                    paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                    { JSON.parse(this.props.propertiesColumnListWithId).map(propertiesColumn => <Column field={propertiesColumn.name} header={propertiesColumn.name}></Column>) }
                                    <Column body={this.actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                            </DataTable>
                        </div>
                        <Dialog visible={this.state.insertDialog} style={{ width: '450px' }} modal className="p-fluid" onHide={this.hideDialog}>
                            <InsertForm className={style.insertForm} key={this.props.valueTable} valueTable = {this.props.valueTable} propertiesColumnList = {this.props.propertiesColumnList} />
                        </Dialog>
                </div>
            </>
        )
    }
}
