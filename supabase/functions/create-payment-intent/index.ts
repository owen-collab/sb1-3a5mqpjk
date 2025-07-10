import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface PaymentRequest {
  amount: number
  currency: string
  rendezvous_id: string
  customer_info: {
    nom: string
    telephone: string
    email?: string
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Parser le body de la requête
    const { amount, currency = 'XAF', rendezvous_id, customer_info }: PaymentRequest = await req.json()

    // Validation des données
    if (!amount || !rendezvous_id || !customer_info?.nom || !customer_info?.telephone) {
      throw new Error('Missing required fields')
    }

    // Initialiser Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Vérifier que le rendez-vous existe
    const { data: rendezvous, error: rendezvousError } = await supabase
      .from('rendezvous')
      .select('*')
      .eq('id', rendezvous_id)
      .single()

    if (rendezvousError || !rendezvous) {
      throw new Error('Rendez-vous not found')
    }

    // Ici, vous intégreriez Stripe pour créer un PaymentIntent réel
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount,
    //   currency: currency.toLowerCase(),
    //   metadata: {
    //     rendezvous_id: rendezvous_id,
    //     customer_name: customer_info.nom,
    //     customer_phone: customer_info.telephone,
    //   },
    // })

    // Pour la démonstration, on simule une réponse Stripe
    const mockPaymentIntent = {
      id: `pi_${Date.now()}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount,
      currency: currency,
      status: 'requires_payment_method',
    }

    // Enregistrer le paiement en base
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        rendezvous_id: rendezvous_id,
        stripe_payment_id: mockPaymentIntent.id,
        amount: amount,
        currency: currency,
        status: 'pending',
        metadata: {
          customer_info: customer_info,
          payment_intent_id: mockPaymentIntent.id,
        },
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error(`Failed to create payment record: ${paymentError.message}`)
    }

    // Retourner la réponse
    return new Response(
      JSON.stringify({
        success: true,
        payment_intent: mockPaymentIntent,
        payment_id: payment.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})