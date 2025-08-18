
import React, { createContext, useContext, useState } from 'react';
import { orders, addOrder, Order } from '@/data/orders';
import { useToast } from '@/hooks/use-toast';

type OrderContextType = {
  orders: Order[];
  addNewOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [ordersList, setOrdersList] = useState<Order[]>(orders);
  const { toast } = useToast();

  const addNewOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder = addOrder(orderData);
    setOrdersList([newOrder, ...ordersList]);
    
    // Notify about new order
    toast({
      title: "New order created",
      description: `Order #${newOrder.id} has been added to the system`,
    });
    
    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ orders: ordersList, addNewOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
