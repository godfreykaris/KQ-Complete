<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Payer;
use PayPal\Api\Amount;
use PayPal\Api\Transaction;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;

class PayPalController extends Controller
{
    protected $apiContext;

    public function __construct()
    {
        $paypalConfig = config('paypal');
        $this->apiContext = new ApiContext(
            new OAuthTokenCredential(
                $paypalConfig['client_id'],
                $paypalConfig['secret']
            )
        );
        $this->apiContext->setConfig($paypalConfig['settings']);
    }

    public function createPayment(Request $request)
    {
        $this->validate($request, [
            'amount' => 'required|numeric|min:0',
            // Add other validation rules as needed
        ]);

        
        $amount = new Amount();
        $amount->setCurrency('USD')
               ->setTotal($request->amount); // Use the validated amount for the payment

        $transaction = new Transaction();
        $transaction->setAmount($amount);

        $redirectUrls = new RedirectUrls();
        $redirectUrls->setReturnUrl(url('/payment/success'))
                     ->setCancelUrl(url('/payment/cancel'));

        $payment = new Payment();
        $payment->setIntent('sale')
                ->setPayer(new Payer())
                ->setTransactions([$transaction])
                ->setRedirectUrls($redirectUrls);

        try 
        {
            $payment->create($this->apiContext);
            return redirect($payment->getApprovalLink());
        } 
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Payment creation failed.'], 500);
        }
    }

    public function handlePaymentResponse(Request $request)
    {
        $paymentId = $request->input('paymentId');
        $payerId = $request->input('PayerID');

        if (!$paymentId || !$payerId) 
        {
            return response()->json(['error' => 'Invalid payment response data.'], 400);
        }

        $payment = Payment::get($paymentId, $this->apiContext);

        $execution = new PaymentExecution();
        $execution->setPayerId($payerId);

        try 
        {
            $result = $payment->execute($execution, $this->apiContext);
            // Handle the payment success and create the booking in your database
            // Send payment confirmation email to the user
            return response()->json(['message' => 'Payment successful.', 'status' => 1], 200);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Payment execution failed.'], 500);
        }
    }
}
