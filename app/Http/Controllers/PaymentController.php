<?php
   
namespace App\Http\Controllers;
   
use Illuminate\Http\Request;

use Stripe\Stripe;
use Stripe\Charge;

   
class PaymentController extends Controller
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function stripe()
    {
        return view('stripe.stripe');
    }
  
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function stripePost(Request $request)
    {
        try
        {
            Stripe::setApiKey(env('STRIPE_SECRET'));
        
            Charge::create([
                "amount" => 100 * 100,
                "currency" => "usd",
                "source" => $request->stripeToken,
                "description" => "Test payment from tutsmake.com." 
            ]);

            session()->flash('success', 'Payment successful!');
        }
        catch (\Stripe\Exception\CardException $e) 
        {
            // Handle specific card errors
            session()->flash('error', $e->getMessage());
        } 
        catch (\Stripe\Exception\RateLimitException | \Stripe\Exception\InvalidRequestException | \Stripe\Exception\AuthenticationException | \Stripe\Exception\ApiConnectionException | \Stripe\Exception\ApiErrorException $e) 
        {
            // Handle general Stripe API errors
            session()->flash('error', 'An error occurred while processing your payment.. Please check your payment details and try again.');
        } 
        catch (\Exception $e) 
        {
            // Handle other unexpected errors
            session()->flash('error', 'An unexpected error occurred.');
        }

        
        return back();
    }

    // Card No : 4242424242424242
    // Month : any future month
    // Year : any future Year
    // CVV : 123
}