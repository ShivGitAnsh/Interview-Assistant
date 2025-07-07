const { createRazorpayInstance } = require("@/lib/razorpay/razorpay.config");
const { supabase } = require("@/services/supabaseClient");
const crypto = require('crypto');

const razorpayInstance = createRazorpayInstance();

exports.createOrder = async (request) => {
  const body = await request.json();
  const { planId } = body;

  if(!planId){
    return {
      status: 400,
      body: { success: false, error: 'Plan ID is required' },
    };
  }

  const { data, error } = await supabase
    .from('plans')
    .select('price, credadd')
    .eq('num', planId)
    .single();

  if (error) {
    console.error('Error fetching plan:', error);
    return {
      status: 400,
      body: { success: false, error: 'Plan not found' },
    };
  }

  const { price } = data;

  const options = {
    amount: price * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await new Promise((resolve, reject) => {
      razorpayInstance.orders.create(options, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

    return {
      status: 200,
      body: { success: true, order },
    };

  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    return {
      status: 500,
      body: { success: false, message: 'Failed to create order' },
    };
  }
};


exports.verifyPayment = async (request) => {
  const body = await request.json();
  const { orderId, paymentId, signature, id, planId } = body;

  const secretKey = process.env.RAZORPAY_SECRET_ID;

  // Step 1: Verify the signature
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature !== signature) {
    return {
      status: 400,
      body: { success: false, message: 'Payment verification failed' },
    };
  }

  try {
    // Step 2: Get credadd from the plan
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('credadd')
      .eq('num', planId)
      .single();

    if (planError || !planData) {
      console.error('Error fetching plan:', planError);
      return {
        status: 400,
        body: { success: false, message: 'Invalid plan ID' },
      };
    }

    const credToAdd = planData.credadd;

    // Step 3: Fetch current credits of the user
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('credits')
      .eq('id', id)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user:', userError);
      return {
        status: 400,
        body: { success: false, message: 'User not found' },
      };
    }

    const updatedCredits = (userData.credits || 0) + credToAdd;

    // Step 4: Update user's credits
    const { error: updateError } = await supabase
      .from('Users')
      .update({ credits: updatedCredits })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating user credits:', updateError);
      return {
        status: 500,
        body: { success: false, message: 'Failed to update user credits' },
      };
    }

    // ✅ All done
    return {
      status: 200,
      body: { success: true, message: 'Payment verified and credits updated' },
    };

  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      status: 500,
      body: { success: false, message: 'Something went wrong' },
    };
  }
};

