import React, { useEffect} from 'react'
import ProductCard from '../components/smallcomponents/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/Slices/productSlice'


const Shop = () => {
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector(state=> state.product)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])
  
  return (
    <>
    <h1 className='uppercase font-light ml-[45vw] mt-2 text-6xl'>shop</h1>

    {loading && <p className="text-center text-gray-500">Loading products...</p>}

      {error && <p className="text-center text-red-500">Error: {error}</p>}
    {
      products.map((product) => (
        <ProductCard 
        key={product.id}
        image={product.images[0]}
        name={product.modelname}
        category={product.category}
        price={product.price}
        />
      ))
    }
    </>
  )
}

export default Shop