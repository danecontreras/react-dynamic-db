import React, { Component } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

export default class DataTableCrudDemo extends Component {

    emptyProduct = {
        actor_id: null,
        first_name: '',
        last_name: '',
        last_update: '2021-01-01T00:00:00.000+0000'
        };

    constructor(props) {
        super(props);
        this.state = {
            products: null,
            productDialog: false,
            deleteProductDialog: false,
            deleteProductsDialog: false,
            product: this.emptyProduct,
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
        this.onCategoryChange = this.onCategoryChange.bind(this);
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
    }

    openNew() {
        this.setState({
            product: this.emptyProduct,
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
        
        if (this.state.product.first_name.trim()) {
            let products = [...this.state.products];
            let product = {...this.state.product};
            if (this.state.product.actor_id) {
                const index = this.findIndexById(this.state.product.actor_id);
                products[index] = product;
                axios.post("http://localhost:8080/" + this.props.valueTable + "/add" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase(), product, {
                    }).then((response) => {
                        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Updated', life: 3000 });
                    }).catch(error => {
                        this.toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                });
            }
            else {
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
                product: this.emptyProduct
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
        let products = this.state.products.filter(val => val.actor_id !== this.state.product.actor_id);
        this.setState({
            products,
            deleteProductDialog: false,
            product: this.emptyProduct
        });
        axios.delete("http://localhost:8080/actor/deleteActor/" + this.state.product.actor_id, {
            }).then((response) => {
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
            }).catch(error => {
                this.toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
        });
    }

    findIndexById(id) {
        let index = -1;
        for (let i = 0; i < this.state.products.length; i++) {
            if (this.state.products[i].id === id) {
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
                axios.delete("http://localhost:8080/actor/deleteActor/" + product.actor_id, {
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

    onCategoryChange(e) {
        let product = {...this.state.product};
        product['category'] = e.value;
        this.setState({ product });
    }

    onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({ product });
        console.log(product)
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
                        dataKey="actor_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={this.state.globalFilter} header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                        <Column hidden = "true" field="actor_id" header="actor_id" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="first_name" header="first_name" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="last_name" header="last_name" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="last_update" header="last_update" sortable style={{ minWidth: '16rem' }}></Column>
                        <Column body={this.actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={this.state.productDialog} style={{ width: '450px' }} header="Record Details" modal className="p-fluid" footer={productDialogFooter} onHide={this.hideDialog}>
                    <div className="p-field">
                        <label htmlFor="first_name">first_name</label>
                        <InputText id="first_name" value={this.state.product.first_name} onChange={(e) => this.onInputChange(e, 'first_name')} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.product.first_name })} />
                        {this.state.submitted && !this.state.product.first_name && <small className="p-error">first_name is required.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="last_name">last_name</label>
                        <InputText id="last_name" value={this.state.product.last_name} onChange={(e) => this.onInputChange(e, 'last_name')} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.product.last_name })} />
                        {this.state.submitted && !this.state.product.last_name && <small className="p-error">last_name is required.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="last_update">last_update</label>
                        <Calendar id="last_update" dateFormat="yy-mm-dd" value={new Date(this.state.product.last_update)}  onChange={(e) => this.onInputChange(e, 'last_update')} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.product.last_update })} showTime showSeconds />
                        {this.state.submitted && !this.state.product.last_update && <small className="p-error">last_update is required.</small>}
                    </div>
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