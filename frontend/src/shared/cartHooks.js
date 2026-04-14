import { useContext } from 'react';
import { CartContext } from './cartContextConfig';

export const useCart = () => useContext(CartContext);
