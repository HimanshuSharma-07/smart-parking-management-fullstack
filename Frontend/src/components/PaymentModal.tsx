import React, { useState } from 'react';
import { X, CreditCard, Wallet, Building2, Smartphone, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    parkingLotName: string;
    spot: string;
    floor: number;
    vehicleNumber: string;
    startTime: string;
    duration: number;
    totalPrice: number;
  };
  onPaymentSuccess: (paymentDetails: any) => void;
}


const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Payment methods
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, Amex',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Google Pay, PhonePe, Paytm',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="w-5 h-5" />,
      description: 'All major banks',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Paytm, PhonePe, Amazon Pay',
    },
  ];

  // Price breakdown
  const basePrice = bookingDetails.totalPrice;
  const tax = Math.round(basePrice * 0.18 * 100) / 100; // 18% GST
  const platformFee = 2;
  const totalAmount = basePrice + tax + platformFee;

  // Razorpay integration
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Create order on your backend
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          bookingDetails: bookingDetails,
        }),
      });

      const orderData = await orderResponse.json();

      // Step 2: Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZERPAY_KEY, // Your Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SmartPark',
        description: `Parking at ${bookingDetails.parkingLotName}`,
        image: '/logo.png', // Your logo
        order_id: orderData.id,
        handler: function (response: any) {
          // Payment successful
          handlePaymentSuccess(response);
        },
        prefill: {
          name: 'John Doe', // Get from user profile
          email: 'john@example.com',
          contact: '9999999999',
        },
        notes: {
          spot: bookingDetails.spot,
          floor: bookingDetails.floor,
          vehicle: bookingDetails.vehicleNumber,
        },
        theme: {
          color: '#2563eb', // Blue color matching your theme
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      alert('Payment failed. Please try again.');
    }
  };

  const handlePaymentSuccess = async (razorpayResponse: any) => {
    try {
      // Step 3: Verify payment on backend
      const verifyResponse = await fetch('/api/verify-razorpay-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          bookingDetails: bookingDetails,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // Payment verified successfully
        setIsProcessing(false);
        onPaymentSuccess({
          ...razorpayResponse,
          totalAmount: totalAmount,
          paymentMethod: selectedMethod,
        });
      } else {
        setIsProcessing(false);
        alert('Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setIsProcessing(false);
      alert('Payment verification failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-sm text-gray-600 mt-1">Secure payment powered by Razorpay</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Booking Summary */}
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Parking Lot:</span>
                <span className="font-semibold text-gray-900">{bookingDetails.parkingLotName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spot:</span>
                <span className="font-semibold text-gray-900">
                  {bookingDetails.spot} (Floor {bookingDetails.floor})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-semibold text-gray-900">{bookingDetails.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">
                  {bookingDetails.duration} {bookingDetails.duration === 1 ? 'hour' : 'hours'}
                </span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Price Breakdown</h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Parking Fee ({bookingDetails.duration}h)</span>
                  <span className="font-semibold text-gray-900">₹{basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold text-gray-900">₹{platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Select Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  disabled={isProcessing}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedMethod === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedMethod === method.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{method.name}</div>
                      <div className="text-xs text-gray-600">{method.description}</div>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Secure Payment
              </p>
              <p className="text-xs text-gray-600">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ₹{totalAmount.toFixed(2)}
              </>
            )}
          </button>
          <p className="text-xs text-center text-gray-600 mt-3">
            By proceeding, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;