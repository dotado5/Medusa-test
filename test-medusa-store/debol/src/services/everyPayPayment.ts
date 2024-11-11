import { AbstractPaymentProcessor, Cart, PaymentProcessorContext, PaymentProcessorError, PaymentProcessorSessionResponse, PaymentProviderService, PaymentSessionStatus } from "@medusajs/medusa";
import ApiClient from "./functions";

interface EveryPayPaymentProps {
    cart: Omit<Cart, "refundable_amount" | "refunded_total">
}


class EveryPayPayment extends AbstractPaymentProcessor {
    client: ApiClient;
    static identifier = "every-pay";

    constructor(container: any, options: any) {
        super(container);
        this.client = options.client;
        this.paymentProviderService = container.paymentProviderService;
    }

    async capturePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        try {
            const paymentId = paymentSessionData.id as string;
            const captureData = await this.client.capture(paymentId);

            return {
                id: paymentId,
                ...captureData
            };
        } catch (e) {
            return { error: e.message };
        }
    }

    async authorizePayment(
        paymentSessionData: Record<string, unknown>,
        context: Record<string, unknown>
    ): Promise<PaymentProcessorError | { status: PaymentSessionStatus; data: Record<string, unknown> }> {
        try {
            await this.client.authorize(paymentSessionData.id as string);

            return {
                status: PaymentSessionStatus.AUTHORIZED,
                data: { id: paymentSessionData.id }
            };
        } catch (e) {
            return { error: e.message };
        }
    }

    async cancelPayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        try {
            const paymentId = paymentSessionData.id as string;
            const cancelData = await this.client.cancel(paymentId);

            return {
                id: paymentId,
                ...cancelData
            };
        } catch (e) {
            return { error: e.message };
        }
    }

    async initiatePayment(
        context: PaymentProcessorContext
    ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
        try {
            const response = await fetch(`https://igw-demo.every-pay.com/api/v4/payments/oneoff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_API_KEY`
                },
                body: JSON.stringify(context)
            });

            console.log(response);


            return {
                session_data: { response: response.json() }
            };
        } catch (e) {
            return { error: e.message };
        }
    }

    async deletePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        try {
            const paymentId = paymentSessionData.id as string;
            await this.client.delete(paymentId);

            return {};
        } catch (e) {
            return { error: e.message };
        }
    }

    async getPaymentStatus(
        paymentSessionData: Record<string, unknown>
    ): Promise<PaymentSessionStatus> {
        try {
            const paymentId = paymentSessionData.id as string;
            return await this.client.getStatus(paymentId) as PaymentSessionStatus;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async refundPayment(
        paymentSessionData: Record<string, unknown>,
        refundAmount: number
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        try {
            const paymentId = paymentSessionData.id as string;
            const refundData = await this.client.refund(paymentId, refundAmount);

            return {
                id: paymentId,
                ...refundData
            };
        } catch (e) {
            return { error: e.message };
        }
    }

    async retrievePayment(
        paymentSessionData: Record<string, unknown>
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        try {
            const paymentId = paymentSessionData.id as string;
            return await this.client.retrieve(paymentId);
        } catch (e) {
            return { error: e.message };
        }
    }

    async updatePayment(
        context: PaymentProcessorContext
    ): Promise<void | PaymentProcessorError | PaymentProcessorSessionResponse> {
        try {
            const paymentId = context.paymentSessionData.id as string;
            // await this.client.update(paymentId, context);

            const response = await fetch(`https://igw-demo.every-pay.com/api/v4/payments/oneoff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_API_KEY`
                },
                body: JSON.stringify(context)
            });

            console.log(response);


            return {
                session_data: { response: response.json(), paymentSessionData: context.paymentSessionData }
            };

        } catch (e) {
            return { error: e.message };
        }
    }

    protected paymentProviderService: PaymentProviderService;

    async updatePaymentData(
        sessionId: string,
        data: Record<string, unknown>
    ): Promise<Record<string, unknown> | PaymentProcessorError> {
        try {
            const paymentSession = await this.paymentProviderService.retrieveSession(sessionId);
            const clientPayment = await this.client.update(paymentSession.data.id as string, data);

            return { id: clientPayment.id };
        } catch (e) {
            return { error: e.message };
        }
    }
}


export default EveryPayPayment