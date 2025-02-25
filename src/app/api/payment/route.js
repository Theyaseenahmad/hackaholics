
import Stripe from 'stripe';
import jwt from 'jsonwebtoken'

//             orderId: order?.data.order.id,
//             price:Number(values.price),
//             product_id:parseInt(values.product_id as string),
//             qty:Number(values.qty),
//             address:values.address,
//             pincode:String(values.pincode)

const jwtSecret = process.env.JWT_SECRET


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req){
    try {
         const authHeader = req.headers.get("authorization");
            if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
            const token = authHeader.split(" ")[1];
            if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
            // Decode the JWT token to get the user's email
            const decoded = jwt.verify(token, jwtSecret);
            const email = decoded.email;
       

        const Data = await req.json()

        const customer = await stripe.customers.create({
            email,
            address: {
                city:Data.address,
                postal_code:Data.pincode
            }
        })

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url:'http://localhost:3000/payment/success/'+customer.id,
            cancel_url:'http://localhost:3000/payment/cancelled/'+customer.id,
            mode:'payment',
            customer:customer.id,
            line_items:[
                {
                    quantity: Number(Data.qty),
                    price_data:{
                        product_data:{
                            name:'crop'
                        },
                        currency:"USD",
                        unit_amount:Number(Data.price)*100
                    }
                }
                
            ],
            metadata: {
                order_id: Data.orderId,  
              },
        })
        return Response.json({checkout:checkoutSession,url:checkoutSession.url},{status:200})
        
    } catch (error) {
        console.log('error',error);
        
        return Response.json({message:"error payment bitch",error},{status:500})
    }
}