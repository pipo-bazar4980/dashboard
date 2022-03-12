import React, {useEffect, useState} from "react";
import {Col, Card, Form, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import {getOneProduct, updateProductss, addItems, itemDelete, updateItem, updateImage} from "../../Api/products";
import {notify} from '../../utils/notification'
import {Alert} from "antd";
import {
    Box,
    Chip,
    TextField,
    Typography,
    Button,
    Grid, Input, FormControlLabel,
} from "@mui/material";
import {useForm} from "react-hook-form";

let formData;
import Switch from '@mui/material/Switch';
import {styled} from '@mui/material/styles';
import Badge from "@mui/material/Badge";


const Android12Switch = styled(Switch)(({theme}) => ({
    padding: 8,
    marginRight: 20,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
    },
}));

const category = [
    {
        _id: "0",
        categoryNames: ""
    },
    {
        _id: "1",
        categoryNames: "(InGame)"
    },
    {
        _id: "2",
        categoryNames: "(IDCode)"
    },
    {
        _id: "3",
        categoryNames: "(Offer)"
    },
    {
        _id: "3",
        categoryNames: "(Subsc)"
    }

]

const ProductUpdate = ({id}) => {

    let [inputLists, setInputLists] = useState([{}]);
    const [inputList, setInputList] = useState([{
        option: "",
        price: ""
    }]);
    const {option, price} = inputList;

    const [updateProduct, setUpdateProduct] = useState({
        gameName: '',
        categoryName: '',
        backUpLink: '',
        image: '',
        details: [],
        topUp: [],
        //formData: '',
    });
    const [stocks, setStocks] = useState(true)
    //let { formData } = updateProduct;
    const [values, setValues] = useState({
        success: false,
        alert: false,
        disabled: false
    })

    const {success, alert, disabled} = values;

    useEffect(() => {
        formData = new FormData()
        // setUpdateProduct({
        //     ...updateProduct,
        //     formData: new FormData()
        // })
    }, []);


    // const handleDetailChange = (e, index) => {
    //     const {name, value} = e.target
    //     const list = [...detailsList];
    //     list[index][name] = value;
    //     setDetailsList(list)
    //     setUpdateProduct({
    //         ...updateProduct,
    //         details: detailsList
    //     })
    //     formData.set("details", JSON.stringify(details))
    //
    // }
    // const handleInputChange = (e, index) => {
    //     const {name, value} = e.target;
    //     const list = [...inputList];
    //     list[index][name] = value;
    //     setInputList(list);
    //     setUpdateProduct({
    //         ...updateProduct,
    //         topUp: inputList
    //     })
    //
    //     let prePackage = [];
    //     for (let i = 0; i < inputLists.length; i++) {
    //         prePackage.push({"option": inputLists[i].option, "price": inputLists[i].price})
    //     }
    //     Array.prototype.push.apply(topUp, prePackage);
    //     formData.set("topUp", JSON.stringify(topUp))
    // };
    const [image, setImage] = useState({})

    const handleChange = (e) => {
        if (e.target.files.length) {
            setImage({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        }
    };

    useEffect(async () => {
        await getOneProduct(id)
            .then((res) => {
                let allData = res.data
                setUpdateProduct(allData)
                setInputLists(allData.topUp)
                setProductInfo('gameName', `${allData.gameName}`)
                setProductInfo('categoryName', `${allData.categoryName}`)
                setProductInfo('backUpLink', `${allData.backUpLink}`)

            })
            .catch((err) => {
                console.log(err.response);
            });
    }, []);

    const handleDelete = (index) => async () => {
        await itemDelete(id, index).then(r => {
            console.log(r.data)
            setInputLists(r.data)
            notify("deleted successfully")
        })
    };

    const [show, setShow] = useState(false)
    //
    const [item, setItem] = useState({})


    const {
        register: getItem,
        handleSubmit: submitItem,
        setValue: setItemValue,
        reset: resetItem,
        formState: {errors: errorItem}
    } = useForm();
    const {
        register: getNewItem,
        handleSubmit: submitNewItem,
        setValue: setNewItemValue,
        reset: resetNewItem,
        formState: {errors: errorNewItem}
    } = useForm();
    const {
        register: productInfo,
        handleSubmit: submitProductInfo,
        setValue: setProductInfo,
        reset: resetProductInfo,
        formState: {errors: errorProductInfo}
    } = useForm();

    function handleClick(option, price, stock, index) {
        setItem({
            id: index,
            option: option,
            price: price,
            stock: stock
        })
        setShow(true)
        setStocks(stock)
        setItemValue("option", `${option}`)
        setItemValue("price", `${price}`)
        setItemValue("stock", `${stock}`)
    }

    const stockFilter = (data) => {
        if (data) {
            return (<>In Stock</>)
        } else {
            return (<>Stock Out</>)
        }
    }

    async function submitItemData(data) {
        const submitData = {
            topUpId: item.id,
            option: data.option,
            price: data.price,
            stock : data.stock
        }

        console.log(submitData)
        await updateItem(id, submitData).then(r => {

            setInputLists(r.data),
                notify("updated successfully")
        })
        resetItem({option: ""})
        resetItem({price: ""})
        resetItem({stock: ""})
        setShow(false)
    }

    const showSuccess = () => {
        if (success) return (<>
            <Redirect to='/admin/product'/>
            <Alert message="Product updated" type="success"/>
        </>)
    }

    function addItem(data) {
        const addData = {
            id: item._id,
            option: data.option,
            price: data.price,
            stock: data.stock
        }
        addItems(id, addData).then(r => {
            setInputLists(r.data),
                notify("added successfully")
        })

    }

    async function submitInfo(data) {
        await updateProductss(id, data).then(r => {
            notify("updated successfully")
        })
    }

    const photoUpdate = () => {
        formData.set("image", image.raw)
        updateImage(id, formData)
            .then(r => {
                notify("Photo updated!")
            })
    }

    function updateForm() {
        return (
            <>
                <Card>
                    <Card.Body>
                        <Card.Title>Update & Delete Product Item</Card.Title>
                        <Form.Label>Change Image</Form.Label>

                        <form onSubmit={submitProductInfo(submitInfo)}>
                            <div>
                                <label htmlFor="contained-button-file">
                                    <Input accept="image/*" id="contained-button-file" type="file"
                                           onChange={e => handleChange(e)}/>
                                    <Button onClick={photoUpdate} style={{backgroundColor: "#1565C0", color: "white"}}>
                                        Save Photo
                                    </Button>
                                </label>
                            </div>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} xl={6}>
                                    <Form.Label>Select Game</Form.Label>
                                    <TextField id="outlined-basic" size="small"
                                               style={{width: '100%'}}
                                               variant="outlined"
                                               {...productInfo("gameName")} />
                                </Grid>
                                <Grid item xs={12} md={6} xl={6}>
                                    <Form.Label>Select Category</Form.Label>
                                    <Form.Control as="select" aria-label="Default select example"
                                                  name="categoryName"
                                                  {...productInfo("categoryName")}>
                                        <option>Select an account type</option>
                                        {
                                            category.map((data, index) => {
                                                    return (
                                                        <option key={index}>{data.categoryNames}</option>
                                                    )
                                                }
                                            )
                                        }
                                    </Form.Control>
                                </Grid>
                            </Grid>
                            <Form.Label>Backup Link</Form.Label>
                            <TextField id="outlined-basic" size="small"
                                       style={{width: '100%', marginBottom: 10}}
                                       variant="outlined"
                                       {...productInfo("backUpLink")} />
                            <Button type='submit' variant='outline'
                                    style={{backgroundColor: "#1565C0", color: "white"}}> Update </Button>
                        </form>

                        <hr/>
                        <Form.Label>
                            Update & Delete Item
                        </Form.Label>
                        <div style={{display: "flex", flexWrap: 'wrap'}}>

                            {inputLists?.map((x, index) => {
                                return (
                                    <Badge style={{marginRight: 30, marginTop: 15}} color="secondary"
                                           badgeContent={stockFilter(x.stock)}>
                                        <Chip
                                            variant="outlined"
                                            style={{marginTop: 10}}
                                            label={`${x.option}  (${x.price} Taka)`}
                                            onClick={e => handleClick(x.option, x.price, x.stock, x._id)}
                                            onDelete={handleDelete(x._id)}
                                            // avatar={}

                                        />
                                    </Badge>
                                    // <Box>
                                    //
                                    //     {/*<FormControlLabel*/}
                                    //     {/*    sx={{mt:2}}*/}
                                    //     {/*    checked={x.stock}*/}
                                    //     {/*    onClick={e=> setStocks(!x.stock) }*/}
                                    //     {/*    name={x.stock}*/}
                                    //     {/*    control={<Android12Switch defaultChecked />}*/}
                                    //     {/*    label=''/>*/}
                                    // </Box>

                                )
                            })}
                        </div>
                        <div style={{marginTop: 10, marginBottom: 10}}>
                            {
                                show && (
                                    <form onSubmit={submitItem(submitItemData)}>
                                        <Typography>
                                            Update Product
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <TextField size="small"
                                                           style={{width: '100%', marginTop: 10}} label="Option"

                                                           variant="outlined" {...getItem("option")} />
                                            </Grid>
                                            <Grid item>
                                                <TextField size="small"

                                                           style={{width: '100%', marginTop: 10}} label="Price"
                                                           variant="outlined" {...getItem("price")}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Form.Group className="mb-3" controlId="addCategory">
                                                    <FormControlLabel
                                                        //onClick={e=>setChecks(!check)}
                                                        //onChange={e => handleInputChange(e, i)}
                                                        name="stock"
                                                        {...getItem("stock")}
                                                        checked={stocks}
                                                        onClick={e => setStocks(!stocks)}
                                                        control={<Android12Switch defaultChecked/>}
                                                        label=""
                                                    />
                                                </Form.Group>
                                            </Grid>
                                            <Grid item>
                                                <Box style={{
                                                    display: "flex",
                                                    justifyContent: 'center',
                                                    marginTop: 10
                                                }}>
                                                    <Button variant="outlined" style={{marginRight: 5}}
                                                            type='submit'>
                                                        update
                                                    </Button>
                                                    <Button variant="outlined" onClick={e => setShow(false)}>
                                                        cancel
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>


                                    </form>
                                )
                            }

                        </div>
                        <form onSubmit={submitNewItem(addItem)}>
                            <hr/>
                            <Form.Label>
                                Add new Item
                            </Form.Label>
                            <Grid container spacing={2}>
                                <Grid item> <TextField size="small"
                                                       style={{width: '100%', marginTop: 10}} label="Option"
                                                       variant="outlined" {...getNewItem("option")} /></Grid>
                                <Grid item> <TextField size="small"
                                                       style={{width: '100%', marginTop: 10}} label="Price"
                                                       variant="outlined" {...getNewItem("price")} /></Grid>
                                <Grid item>
                                    <Form.Group className="mb-3" controlId="addCategory">
                                        <FormControlLabel
                                            //onClick={e=>setChecks(!check)}
                                            //onChange={e => handleInputChange(e, i)}
                                            name="stock"
                                            {...getNewItem("stock")}
                                            checked={stocks}
                                            onClick={e => setStocks(!stocks)}
                                            control={<Android12Switch defaultChecked/>}
                                            label=""
                                        />
                                    </Form.Group>
                                </Grid>
                                <Grid item><Button type='submit' style={{width: '100%', marginTop: 10}}
                                                   variant="outlined">Add Item</Button></Grid>
                            </Grid>
                        </form>
                    </Card.Body>
                </Card>

            </>
        )
    }

    return (
        <div>
            {showSuccess()}
            {updateForm()}
        </div>
    )
}

export default ProductUpdate;