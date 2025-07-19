import productmodel from '../models/Product.model.js';

export const CreateProduct = async (productData, companyId)=>{
    const product = new productmodel({
         ...productData,
    company: companyId
    });
    return await product.save();
}

export const GetAllProduct = async ()=>{
    return await productmodel.find();
}

