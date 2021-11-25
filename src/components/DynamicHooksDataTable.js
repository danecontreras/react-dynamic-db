import React, { useEffect, useState, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';

import axios from 'axios';

const DynamicHooksDataTable = ({valueTable, propertiesColumnList, propertiesColumnListWithId}) => {

    const [emptyProduct, setEmptyProduct] = useState(null);
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:8080/" + valueTable + "/" + valueTable + "List")
            .then(res => {
                setProducts(res.data)
            })
        axios.get("http://localhost:8080/" + valueTable + "/describe")
            .then(res => {
                let emptyP = {}
                res.data.map(result => emptyP[result.name] = typeChecker(result.type))
                setEmptyProduct(emptyP)
                setProduct(emptyP)
            })
    }, []); 

    const typeChecker = (type) => {
        if(type === "varchar" || type === "text") {
            return ''
        } else if(type === "int" || type === "tinyint" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "tinyint unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return null
        } else if(type === "timestamp") {
            return '2021-01-01T00:00:00.000+0000'
        }
    }

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);

        if (product.first_name.trim()) {
            let _products = [...products];
            let _product = {...product};
            if (product.actor_id) {
                const index = findIndexById(product.actor_id);

                _products[index] = _product;
                axios.post("http://localhost:8080/" + valueTable + "/add" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase(), product, {
                    }).then((response) => {
                        toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Updated', life: 3000 });
                    }).catch(error => {
                        toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                });
            }
            else {
                axios.post("http://localhost:8080/" + valueTable + "/add" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase(), product, {
                    }).then((response) => {
                        toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Added', life: 3000 });
                    }).catch(error => {
                        toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
                });
            }
        

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    }

    const editProduct = (product) => {
        setProduct({...product});
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        axios.delete("http://localhost:8080/" + valueTable + "/delete" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase() + "/" + product[Object.keys(emptyProduct)[0]], {
            }).then((response) => {
                toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
            }).catch(error => {
                toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
        });
        let _products = products.filter(val => val.actor_id !== product.actor_id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        selectedProducts.map((product) => 
            axios.delete("http://localhost:8080/" + valueTable + "/delete" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase() + "/" + product[Object.keys(emptyProduct)[0]], {
            }).then((response) => {
                toast.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
            }).catch(error => {
                toast.show({ severity: 'error', summary: 'Error', detail: 'Error', life: 3000 });
            })
        )
            
        let _products = products.filter(val => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-mx-0 p-my-1">Manage Products</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );
    
    const inputTypeChecker = (name, type) => {
        if(type === "varchar" || type === "text") {
            return <InputText id={name} value={product[name]} onChange={(e) => this.onInputChange(e, name)} required autoFocus className={classNames({ 'p-invalid': submitted && !product[name] })} />
        } else if(type === "int" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return <InputNumber id={name} value={product[name]} onChange={(e) => this.onInputChange(e, name)} required autoFocus className={classNames({ 'p-invalid': submitted && !product[name] })} />
        } else if(type === "timestamp") {
            return <Calendar id={name} dateFormat="yy-mm-dd" value={new Date(product[name])}  onChange={(e) => this.onInputChange(e, name)} required autoFocus className={classNames({ 'p-invalid': submitted && !product[name] })} showTime showSeconds />
        } else if(type === "tinyint") {
            return (
                <>  
                    <div>
                        <RadioButton name={product[name] + 1} value={product[name]} onChange={(e) => this.onInputChange(e, name)} checked={product[name] === 1} />
                            true
                        <br />
                        <RadioButton name={product[name] + 2} value={product[name]} onChange={(e) => this.onInputChange(e, name)} checked={product[name] === 0} />
                            false
                    </div>
                </>
            )
        }
    }

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey={Object.keys(emptyProduct)[0]} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                        { JSON.parse(propertiesColumnListWithId).map(propertiesColumn => <Column field={propertiesColumn.name} header={propertiesColumn.name} ></Column>) }
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    {   
                        JSON.parse(propertiesColumnList).map((propertiesColumn) => 
                            <div className="p-field">     
                                <h4>{propertiesColumn.name}</h4>           
                                {inputTypeChecker(propertiesColumn.name, propertiesColumn.type)}
                                {submitted && !product[propertiesColumn.name] && <small className="p-error">{propertiesColumn.name} is required.</small>}
                            </div>
                        )
                    }
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to delete <b>{product.first_name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default DynamicHooksDataTable