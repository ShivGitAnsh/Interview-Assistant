"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { toast } from 'sonner'
import { useUser } from '@/app/provider'

const plans = [
  { title: "Basic", price: 200, description: "Adds 2 more credits", planId: 1 },
  { title: "Standard", price: 400, description: "Adds 4 more credits", planId: 2 },
  { title: "Advanced", price: 600, description: "Adds 6 more credits", planId: 3 },
  { title: "Premium", price: 800, description: "Adds 8 more credits", planId: 4 },
]

const Billing = () => {

  const { user } = useUser();
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const onPayment = async (planId) => {
    try {
      const res = await axios.post("/api/payments/createOrder", { planId });
      const data = res.data;

      const paymentObject = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.order.id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Course Platform",
        description: "Course Plan Purchase",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("/api/payments/verifyPayment", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              id : user?.id,
              planId: planId
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful! Credits added to your account.");
            } else {
              toast.error("Payment verification failed. Please try again.");
            }
          } catch (err) {
            toast.error("Error verifying payment.");
            console.error(err);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact : "9999999999"
        },
        theme: {
          color: "#6366f1",
        }
      });

      paymentObject.open();

    } catch (error) {
      toast.error("Error creating payment order.");
      console.error(error);
    }
  }

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js")
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Choose Your Course Plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.title} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">₹{plan.price}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => onPayment(plan.planId)} className="w-full">
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Billing
