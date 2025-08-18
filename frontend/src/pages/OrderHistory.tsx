
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, Calendar, DollarSign } from "lucide-react";
import { getOrderStatusColor } from "@/data/orders";
import { products } from "@/data/products";
import { useOrderUpdates } from "@/context/OrderUpdatesContext";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders } = useOrderUpdates();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProductInfo = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <Button onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
            <Button onClick={() => navigate('/shop')}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const product = getProductInfo(order.products[0]?.productId);
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Order #{order.id}
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {product && (
                          <>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-gray-600">
                                {product.squareFeet} sq ft • Quantity: {order.products[0]?.quantity || 1}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/order-tracking/${order.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Track Order
                        </Button>
                        {product && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            View Product
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;
