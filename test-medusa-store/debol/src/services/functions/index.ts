import { PaymentProcessorContext, PaymentSessionStatus } from "@medusajs/medusa";
import axios from "axios";

export const generateRandomString = (length: number) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

class ApiClient {

    async capture(paymentId: string): Promise<Record<string, unknown>> {
        // Implement the API call to capture the payment
        // Example:
        const response = await fetch(`https://api.paymentprovider.com/payments/${paymentId}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            }
        });
        return response.json();
    }

    async authorize(paymentId: string): Promise<void> {
        // Implement the API call to authorize the payment
        const response = await fetch(`https://api.paymentprovider.com/payments/${paymentId}/authorize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    }

    async cancel(paymentId: string): Promise<Record<string, unknown>> {
        // Implement the API call to cancel the payment
        const response = await fetch(`https://api.paymentprovider.com/payments/${paymentId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            }
        });
        return response.json();
    }

    async initiate(context: PaymentProcessorContext): Promise<{ id: string }> {

        const url = "https://igw-demo.every-pay.com/api/v4/payments/oneoff"
        const API_username = "636c0877bfc71ae4"
        const API_secret = "1d13e67ae716b1b84999c4e456683b46"
        const encodedCredentials = Buffer.from(
            `${API_username}:${API_secret}`
        ).toString("base64")
        const randomString = generateRandomString(13)

        // Implement the API call to initiate the payment

        const options = {
            headers: {
                Authorization: `Basic ${encodedCredentials}`,
                "Content-Type": "application/json",
            },
        }

        const data = {
            // structured_reference: 5705872,
            payment_description: "example.com 84005a6c",
            account_name: "EUR3D1",
            nonce: randomString,
            timestamp: new Date(),
            amount: context.amount,
            order_reference: "84005a6c",
            request_token: true,
            token_agreement: "unscheduled",
            email: context.email,
            customer_ip: "53.62.137.190",
            customer_url: "www.example.com",
            locale: "et",
            api_username: "636c0877bfc71ae4",
            preferred_country: "EE",
            billing_city: context.billing_address.city,
            billing_country: context.billing_address.country_code.toLocaleUpperCase(),
            billing_line1: context.billing_address.address_1,
            billing_line2: context.billing_address.address_2,
            billing_line3: null,
            billing_postcode: context.billing_address.postal_code,
            billing_state: "EE-37",
            shipping_city: context.billing_address.city,
            shipping_country: context.billing_address.country_code.toLocaleUpperCase(),
            shipping_line1: context.billing_address.address_1,
            shipping_line2: context.billing_address.address_2,
            shipping_line3: null,
            shipping_postcode: context.billing_address.postal_code,
            shipping_state: "EE-37",
            mobile_payment: true,
            token_consent_agreed: true,
            integration_details: {
                integration: "Custom",
                software: "eCommerce",
                version: 2.1,
            },
        }

        try {
            axios
                .post(url, data, options)
                .then(async (response) => {
                    console.log(response.data)
                    return response.data.payment_methods
                })
                .catch((error) => {
                    console.log("error:" + error)
                })
        } catch (error) {
            console.log(error);
        }

        return
    }

    async delete(paymentId: string): Promise<void> {
        // Implement the API call to delete the payment
        const response = await fetch(`https://api.paymentprovider.com/payments/${paymentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    }

    async getStatus(paymentId: string): Promise<PaymentSessionStatus> {
        // Implement the API call to get the payment status
        const response = await fetch(`https://api.paymentprovider.com/payments/${paymentId}/status`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`
            }
        });
        return response.json();
    }

    async refund(paymentId: string, refundAmount: number): Promise<Record<string, unknown>> {
        // Implement the API call to refund the payment
        const response = await fetch(`https://api.paymentprovider.com/payments/${paymentId}/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify({ amount: refundAmount })
        });
        return response.json();
    }

    async retrieve(paymentId: string): Promise<Record<string, unknown>> {
        // Implement the API call to retrieve the payment details
        const response = await fetch(`https://api.paymentprovider.com/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`
            }
        });
        return response.json();
    }

    async update(paymentId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
        // Implement the API call to update the payment
        const response = await fetch(`https://api.paymentprovider.com/payments/${paymentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
}

export default ApiClient