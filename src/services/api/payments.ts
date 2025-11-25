import {apiClient} from './client';
import {Payment} from '../../types/payment';

export interface CreatePaymentIntentRequest {
  job_id: string;
  amount: number;
}

export interface ConfirmPaymentRequest {
  payment_intent_id: string;
  payment_method_id: string;
}

export const paymentsApi = {
  async createPaymentIntent(
    data: CreatePaymentIntentRequest,
  ): Promise<{client_secret: string; payment_intent_id: string}> {
    const response = await apiClient.post('/create-payment-intent', data);
    return response.data;
  },

  async confirmPayment(data: ConfirmPaymentRequest): Promise<Payment> {
    const response = await apiClient.post('/confirm-payment', data);
    return response.data;
  },

  async capturePayment(paymentIntentId: string): Promise<Payment> {
    const response = await apiClient.post('/capture-payment', {
      payment_intent_id: paymentIntentId,
    });
    return response.data;
  },

  async getPaymentByJobId(jobId: string): Promise<Payment> {
    const response = await apiClient.get(`/payments/job/${jobId}`);
    return response.data;
  },

  async refundPayment(paymentId: string): Promise<Payment> {
    const response = await apiClient.post('/refund-payment', {
      payment_id: paymentId,
    });
    return response.data;
  },
};

