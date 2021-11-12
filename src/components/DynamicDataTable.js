import React, { Component } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import {RadioButton } from 'primereact/radiobutton'


export default class DynamicDataTable extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            products: null,
            productDialog: false,
            deleteProductDialog: false,
            deleteProductsDialog: false,
            emptyProduct: {},
            product: {},
            selectedProducts: null,
            submitted: false,
            globalFilter: null
        };
        
        this.leftToolbarTemplate = this.leftToolbarTemplate.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);

        this.openNew = this.openNew.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.confirmDeleteProduct = this.confirmDeleteProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.confirmDeleteSelected = this.confirmDeleteSelected.bind(this);
        this.deleteSelectedProducts = this.deleteSelectedProducts.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputNumberChange = this.onInputNumberChange.bind(this);
        this.hideDeleteProductDialog = this.hideDeleteProductDialog.bind(this);
        this.hideDeleteProductsDialog = this.hideDeleteProductsDialog.bind(this);
    }

    componentDidMount() {
        axios.get("http://localhost:8080/" + this.props.valueTable + "/" + this.props.valueTable + "List")
            .then(res => {
                this.setState({products: res.data})
            })
        axios.get("http://localhost:8080/" + this.props.valueTable + "/describe")
        .then(res => {
            let emptyProduct = {}
            res.data.map(result => emptyProduct[result.name] = this.typeChecker(result.type))
            this.setState({emptyProduct})
        })
    }

    typeChecker = (type) => {
        if(type === "varchar" || type === "text") {
            return ''
        } else if(type === "int" || type === "tinyint" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "tinyint unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return null
        } else if(type === "timestamp") {
            return '2021-01-01T00:00:00.000+0000'
        }
    }

    openNew() {
        this.setState({
            product: this.state.emptyProduct,
            submitted: false,
            productDialog: true
        });
    }

    hideDialog() {
        this.setState({
            submitted: false,
            productDialog: false
        });
    }

    hideDeleteProductDialog() {
        this.setState({ deleteProductDialog: false });
    }

    hideDeleteProductsDialog() {
        this.setState({ deleteProductsDialog: false });
    }

    saveProduct() {
        let state = { submitted: true };

        if (this.state.product[Object.keys(this.state.emptyProduct)[1]].trim()) {
            let products = [...this.state.products];
            let product = {...this.state.product};
            
            if (this.state.product[Object.keys(this.state.emptyProduct)[0]]) {
                const index = this.findIndexById(this.state.product[Object.keys(this.state.emptyProduct)[0]]);
                products[index] = product;
                axios.post("http://localhost:8080/" + this.props.valueTable + "/add" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase(), product, {
                    }).then((response) => {
                        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Updated', life: 3000 });
                    }).catch(error => {
                        this.toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                });
            } else {
                axios.post("http://localhost:8080/" + this.props.valueTable + "/add" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase(), product, {
                    }).then((response) => {
                        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Added', life: 3000 });
                    }).catch(error => {
                        this.toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                });
            }

            state = {
                ...state,
                products,
                productDialog: false,
                product: this.state.emptyProduct
            };
        }

        this.setState(state);
    }

    editProduct(product) {
        this.setState({
            product: { ...product },
            productDialog: true
        });
    }

    confirmDeleteProduct(product) {
        this.setState({
            product,
            deleteProductDialog: true
        });
    }

    deleteProduct() {
        let products = this.state.products.filter(val => val[Object.keys(this.state.emptyProduct)[0]] !== this.state.product[Object.keys(this.state.emptyProduct)[0]]);
        this.setState({
            products,
            deleteProductDialog: false,
            product: this.state.emptyProduct
        });
        axios.delete("http://localhost:8080/" + this.props.valueTable + "/delete" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase() + "/" + this.state.product[Object.keys(this.state.emptyProduct)[0]], {
            }).then((response) => {
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
            }).catch(error => {
                this.toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
        });
    }

    findIndexById(id) {
        let index = -1;
        for (let i = 0; i < this.state.products.length; i++) {
            if (this.state.products[Object.keys(this.state.emptyProduct)[0]] === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    confirmDeleteSelected() {
        this.setState({ deleteProductsDialog: true });
    }

    deleteSelectedProducts() {
        this.state.selectedProducts.map((product) => 
                axios.delete("http://localhost:8080/" + this.props.valueTable + "/delete" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase() + "/" + product[Object.keys(this.state.emptyProduct)[0]], {
                }).then((response) => {
                    this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
                }).catch(error => {
                    this.toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                })
            )
        
        let products = this.state.products.filter(val => !this.state.selectedProducts.includes(val));
        this.setState({
            products,
            deleteProductsDialog: false,
            selectedProducts: null
        });
    }

    onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({ product });
    }

    onInputNumberChange(e, name) {
        const val = e.value || 0;
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({ product });
    }

    leftToolbarTemplate() {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={this.openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={this.confirmDeleteSelected} disabled={!this.state.selectedProducts || !this.state.selectedProducts.length} />
            </React.Fragment>
        )
    }

    actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => this.editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => this.confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    inputTypeChecker = (name, type) => {
        if(type === "varchar" || type === "text") {
            return <InputText id={name} value={this.state.product[name]} onChange={(e) => this.onInputChange(e, name)} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.product[name] })} />
        } else if(type === "int" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return <InputNumber id={name} value={this.state.product[name]} onChange={(e) => this.onInputChange(e, name)} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.product[name] })} />
        } else if(type === "timestamp") {
            return <Calendar id={name} dateFormat="yy-mm-dd" value={new Date(this.state.product[name])}  onChange={(e) => this.onInputChange(e, name)} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.product[name] })} showTime showSeconds />
        } else if(type === "tinyint") {
            return (
                <>  
                    <div>
                        <RadioButton name={this.state.product[name] + 1} value={this.state.product[name]} onClick={(e) => this.setState({   })} onChange={(e) => this.onInputChange(e, name)} checked={this.state.product[name] === 1} />
                            true
                        <br />
                        <RadioButton name={this.state.product[name] + 2} value={this.state.product[name]} onClick={(e) => this.setState({   })} onChange={(e) => this.onInputChange(e, name)} checked={this.state.product[name] === 0} />
                            false
                    </div>
                </>
            )
        }
    }

    render() {
        
        const header = (
            <div className="table-header">
                <h5 className="p-mx-0 p-my-1">Manage Products</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search..." />
                </span>
            </div>
        );
        const productDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.saveProduct} />
            </React.Fragment>
        );
        const deleteProductDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteProduct} />
            </React.Fragment>
        );
        const deleteProductsDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductsDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteSelectedProducts} />
            </React.Fragment>
        );

        return (
            <div className="datatable-crud-demo">
                <Toast ref={(el) => this.toast = el} />

                <div className="card">
                    <Toolbar className="p-mb-4" left={this.leftToolbarTemplate}></Toolbar>

                    <DataTable ref={(el) => this.dt = el} value={this.state.products} selection={this.state.selectedProducts} onSelectionChange={(e) => this.setState({ selectedProducts: e.value })}
                        dataKey={Object.keys(this.state.emptyProduct)[0]} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={this.state.globalFilter} header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                        { JSON.parse(this.props.propertiesColumnListWithId).map(propertiesColumn => <Column field={propertiesColumn.name} header={propertiesColumn.name} ></Column>) }
                        <Column body={this.actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={this.state.productDialog} style={{ width: '450px' }} header="Record Details" modal className="p-fluid" footer={productDialogFooter} onHide={this.hideDialog}>
                    {   
                        JSON.parse(this.props.propertiesColumnList).map((propertiesColumn) => 
                            <div className="p-field">     
                                <h4>{propertiesColumn.name}</h4>           
                                {this.inputTypeChecker(propertiesColumn.name, propertiesColumn.type)}
                                {this.state.submitted && !this.state.product[propertiesColumn.name] && <small className="p-error">{propertiesColumn.name} is required.</small>}
                            </div>
                        )
                    }
                </Dialog>

                <Dialog visible={this.state.deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={this.hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.product && <span>Are you sure you want to delete <b>{this.state.product.first_name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={this.state.deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={this.hideDeleteProductsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.product && <span>Are you sure you want to delete the selected records?</span>}
                    </div>
                </Dialog>
            </div>
        );
    }
}