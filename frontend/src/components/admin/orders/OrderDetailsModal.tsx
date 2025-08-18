import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order, getOrderStatusColor, OrderStatus } from '@/data/orders';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/formatters';
import { 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Package, 
  Truck,
  Clock,
  FileText
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onConfirmPayment: (order: Order) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  onConfirmPayment
}) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Order Details - {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Payment Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-500">Order Status</label>
              <div className="mt-1">
                <Select
                  value={order.status}
                  onValueChange={(value: OrderStatus) => onStatusUpdate(order.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="In Production">In Production</SelectItem>
                    <SelectItem value="Ready for Delivery">Ready for Delivery</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Payment Status</label>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={order.paymentStatus === 'Confirmed' ? 'default' : 'secondary'}>
                  {order.paymentStatus}
                </Badge>
                {order.paymentStatus === 'Pending' && (
                  <Button
                    size="sm"
                    onClick={() => onConfirmPayment(order)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Confirm Payment
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Customer Information</h3>
                  <p className="text-lg font-medium">{order.customerName}</p>
                  <p className="text-gray-600">{order.customerEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Order Timeline</h3>
                  <p className="text-sm">Ordered: {formatDate(order.createdAt)}</p>
                  {order.estimatedDelivery && (
                    <p className="text-sm">Est. Delivery: {order.estimatedDelivery}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {order.shippingAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                    <p className="text-sm">
                      {order.shippingAddress}<br />
                      {order.shippingCity}, {order.shippingState} {order.shippingZip}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Order Total</h3>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Ordered Products</h3>
            </div>
            
            <div className="space-y-4">
              {orderProducts.map((product, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <img 
                    src={product?.image || '/placeholder.svg'} 
                    alt={product?.name || 'Product'}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product?.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product?.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{product?.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <p className="font-medium">{product?.squareFeet} sq ft</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <p className="font-medium">{product?.quantity}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <p className="font-medium text-green-600">{formatPrice(product?.price || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Updates */}
          {order.trackingUpdates && order.trackingUpdates.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Order Timeline</h3>
              </div>
              
              <div className="space-y-3">
                {order.trackingUpdates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{update.status}</p>
                      <p className="text-sm text-gray-600">{update.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(update.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;