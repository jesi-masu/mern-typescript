
import React, { createContext, useContext, useState, useEffect } from 'react';
import { orders, Order, OrderStatus } from '@/data/orders';

interface OrderUpdatesContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => void;
}

const OrderUpdatesContext = createContext<OrderUpdatesContextType | undefined>(undefined);

export const OrderUpdatesProvider = ({ children }: { children: React.ReactNode }) => {
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);

  // Listen for order updates from admin panel
  useEffect(() => {
    const handleOrderUpdate = (event: CustomEvent) => {
      const { orderId, newStatus } = event.detail;
      updateOrderStatus(orderId, newStatus);
    };

    window.addEventListener('orderStatusUpdated', handleOrderUpdate as EventListener);
    
    return () => {
      window.removeEventListener('orderStatusUpdated', handleOrderUpdate as EventListener);
    };
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setLocalOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const getOrderById = (orderId: string) => {
    return localOrders.find(order => order.id === orderId);
  };

  const refreshOrders = () => {
    setLocalOrders([...orders]);
  };

  return (
    <OrderUpdatesContext.Provider value={{
      orders: localOrders,
      updateOrderStatus,
      getOrderById,
      refreshOrders
    }}>
      {children}
    </OrderUpdatesContext.Provider>
  );
};

export const useOrderUpdates = () => {
  const context = useContext(OrderUpdatesContext);
  if (context === undefined) {
    throw new Error('useOrderUpdates must be used within an OrderUpdatesProvider');
  }
  return context;
};
