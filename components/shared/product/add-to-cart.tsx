'use client';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';
import { addItemToCart } from '@/lib/actions/cart.actions';

type AddToCartProps = { item: CartItem; outOfStock: boolean };

const AddToCart = ({ item, outOfStock }: AddToCartProps) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res?.success) {
      toast.error(res.message);
      return;
    }

    // Handle success add to cart
    toast.success(res.message, {
      action: (
        <Button
          className="bg-primary altText='Go To Cart cursor-pointer text-white hover:bg-gray-800"
          onClick={() => router.push('/cart')}
        >
          Go To Cart
        </Button>
      ),
    });
  };

  return (
    <Button
      className="w-full cursor-pointer"
      type="button"
      onClick={handleAddToCart}
      disabled={outOfStock}
    >
      <Plus />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
