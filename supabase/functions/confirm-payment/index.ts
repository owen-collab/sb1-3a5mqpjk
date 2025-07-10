import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ConfirmPaymentRequest {
  payment_intent_id: string
  payment_method?: string
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
    const { payment_intent_id, payment_method = 'card' }: ConfirmPaymentRequest = await req.json()

    // Validation des données
    if (!payment_intent_id) {
      throw new Error('Missing payment_intent_id')
    }

    // Initialiser Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Trouver le paiement en base
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, rendezvous(*)')
      .eq('stripe_payment_id', payment_intent_id)
      .single()

    if (paymentError || !payment) {
      throw new Error('Payment not found')
    }

    // Ici, vous confirmeriez le paiement avec Stripe
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
    // const confirmedPayment = await stripe.paymentIntents.confirm(payment_intent_id)

    // Pour la démonstration, on simule une confirmation réussie
    const mockConfirmedPayment = {
      id: payment_intent_id,
      status: 'succeeded',
      amount: payment.amount,
      currency: payment.currency,
    }

    // Mettre à jour le statut du paiement
    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        payment_method: payment_method,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    if (updatePaymentError) {
      throw new Error(`Failed to update payment: ${updatePaymentError.message}`)
    }

    // Mettre à jour le statut du rendez-vous
    const { error: updateRendezvousError } = await supabase
      .from('rendezvous')
      .update({
        payment_status: 'paid',
        status: 'confirme',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.rendezvous_id)

    if (updateRendezvousError) {
      throw new Error(`Failed to update rendezvous: ${updateRendezvousError.message}`)
    }

    // Retourner la réponse
    return new Response(
      JSON.stringify({
        success: true,
        payment: mockConfirmedPayment,
        rendezvous_id: payment.rendezvous_id,
        message: 'Payment confirmed successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error confirming payment:', error)
    
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