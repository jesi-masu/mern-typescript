import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import { OrderStatus, PaymentStatus } from '@/data/orders';

interface CheckoutFormProps {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  };
}

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const CheckoutForm = ({ product }: CheckoutFormProps) => {
  const [orderData, setOrderData] = useState<OrderData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addNewOrder } = useOrders();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOrderSubmit = (orderData: any) => {
    const newOrder = addNewOrder({
      customerId: orderData.email,
      customerName: `${orderData.firstName} ${orderData.lastName}`,
      customerEmail: orderData.email,
      products: [{ productId: product.id, quantity: 1 }],
      status: "Pending" as OrderStatus,
      paymentStatus: "Pending" as PaymentStatus,
      totalAmount: product.price,
    });

    toast({
      title: "Order placed!",
      description: `Your order #${newOrder.id} has been placed.`,
    });
    navigate(`/order-tracking/${newOrder.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOrderSubmit(orderData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={orderData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={orderData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={orderData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={orderData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={orderData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                type="text"
                id="state"
                name="state"
                value={orderData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                type="text"
                id="zipCode"
                name="zipCode"
                value={orderData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button type="submit">Place Order</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
