import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart, showCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

export const useCart = () => {
  const dispatch = useDispatch();

 const handleAddToCart = (product) => {
  dispatch(addToCart(product))
    .unwrap()
    .then(() => {
      dispatch(showCart()); // refresh the cart items
      toast.success("Added to cart");
    })
    .catch(err => toast.error(err));
};


  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id))
      .unwrap()
      .then(() => toast.success("Removed"))
      .catch(err => toast.error(err));
  };

  return { handleAddToCart, handleRemoveFromCart };
};
