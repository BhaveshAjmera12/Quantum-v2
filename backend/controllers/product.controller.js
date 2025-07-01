import * as productservice from '../services/product.service.js'

export const CreateProductController = async (req,res)=>{
    try {
        const newproduct = await productservice.CreateProduct(req.body)
        console.log("REQ BODY:", req.body);
        res.status(200).json(newproduct);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

export const GetAllProducts = async (req,res)=>{
    try {
        const products= await productservice.GetAllProduct();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}