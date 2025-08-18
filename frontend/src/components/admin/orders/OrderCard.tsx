import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order, getOrderStatusColor, OrderStatus } from '@/data/orders';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/formatters';
import { 
  Clock, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  User,
  MapPin,
  Calendar,
  ShoppingBag
} from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
  onConfirmPayment: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusUpdate,
  onViewDetails,
  onConfirmPayment
}) => {
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'In Review':
        return <Eye className="h-4 w-4" />;
      case 'In Production':
        return <Package className="h-4 w-4" />;
      case 'Ready for Delivery':
        return <Truck className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderProducts = () => {
    return order.products.map(orderProduct => {
      const product = products.find(p => p.id === orderProduct.productId);
      return { ...product, quantity: orderProduct.quantity };
    }).filter(Boolean);
  };

  const orderProducts = getOrderProducts();

  return (
    <Card className="border rounded-lg hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-lg text-gray-900">{order.id}</span>
            </div>
            <Badge className={getOrderStatusColor(order.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            </Badge>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-green-600">{formatPrice(order.totalAmount)}</p>
            <Badge variant={order.paymentStatus === 'Confirmed' ? 'default' : 'secondary'}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium text-gray-900">{order.customerName}</p>
              <p className="text-sm text-gray-600">{order.customerEmail}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
              {order.estimatedDelivery && (
                <p className="text-sm text-gray-600">Est. Delivery: {order.estimatedDelivery}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="h-4 w-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Shipping Address</p>
              <p className="text-sm text-gray-900">
                {order.shippingAddress}, {order.shippingCity}, {order.shippingState} {order.shippingZip}
              </p>
            </div>
          </div>
        )}

        {/* Product Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Products ({orderProducts.length})</p>
          <div className="flex gap-2 overflow-x-auto">
            {orderProducts.slice(0, 3).map((product, index) => (
              <div key={index} className="flex-shrink-0 relative">
                <img 
                  src={product?.image || '/placeholder.svg'} 
                  alt={product?.name || 'Product'}
                  className="w-16 h-16 object-cover rounded border"
                />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-600 hover:bg-blue-600 flex items-center justify-center">
                  {product?.quantity}
                </Badge>
              </div>
            ))}
            {orderProducts.length > 3 && (
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                <span className="text-xs text-gray-600">+{orderProducts.length - 3}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(order)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          
          {order.paymentStatus === 'Pending' && (
            <Button
              size="sm"
              onClick={() => onConfirmPayment(order)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="h-4 w-4" />
              Confirm Payment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;