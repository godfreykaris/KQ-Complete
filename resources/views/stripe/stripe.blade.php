<!DOCTYPE html>
<html>
<head>
    <title>Laravel 10 - Stripe Payment Gateway Integration Tutorial Example - Tutsmake.com</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

    <style type="text/css">
        
        .container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .credit-card-box {
            padding: 20px;
        }
        /* Style the panel title */
        .panel-title {
            font-weight: bold;
            margin-top: 5px;

        }
        /* Style the success and error messages */
        .alert {
            text-align: center;
            margin-top: 20px;
        }
        /* Style the form inputs */
        .form-group.required label {
            font-weight: bold;
        }
        /* Center the form submit button */
        .btn-block {
            text-align: center;
        }
        /* Add some space below the form */
        .panel-body {
            margin-bottom: 20px;
        }

        img {
            max-width: 200px;
            height: auto; /* Maintain aspect ratio */
        }
        
    </style>
</head>
<body>
  
<div class="container">
    <div class="row">
        <div class="col-lg-12">
            <div class="panel panel-default credit-card-box">
                <div class="panel-heading text-center">
                    <div class="row">
                        <div class="col-lg-12">
                            <img class="mx-auto d-block" src="{{ asset('images/stripe.jfif') }}"  alt="Stripe Logo Image">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <h3 class="panel-title">Payment Details</h3>
                        </div>
                    </div>
                </div>
                <div class="panel-body">
                    @if (Session::has('error') || Session::has('success'))
                        <div class="alert {{ Session::has('success') ? 'alert-success' : 'alert-danger' }}">
                            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                            <p>{{ Session::get('success') ?: Session::get('error') }}</p>
                        </div>
                    @endif

                    <form 
                        role="form" 
                        action="{{ route('stripe.post') }}" 
                        method="post" 
                        class="require-validation"
                        data-cc-on-file="false"
                        data-stripe-publishable-key="{{ env('STRIPE_KEY') }}"
                        id="payment-form">
                        @csrf

                        <div class='form-group required'>
                            <label class='control-label'>Name on Card</label>
                            <input class='form-control' id='nameOnCard' size='4' type='text' placeholder="John">
                        </div>

                        <div class='form-group card required'>
                            <label class='control-label'>Card Number</label>
                            <input autocomplete='off' class='form-control card-number' id='cardNumber' size='20' type='text' placeholder="4242424242424242">
                        </div>

                        <div class='form-group'>
                            <div class='row'>
                                <div class='col-sm-12 col-md-4'>
                                    <label class='control-label'>CVC</label>
                                    <input autocomplete='off' class='form-control card-cvc' id='cvc' placeholder='ex. 311' size='4' type='text' placeholder="123">
                                </div>
                                <div class='col-sm-12 col-md-4'>
                                    <label class='control-label'>Expiration Month</label>
                                    <input class='form-control card-expiry-month' id='expiryMonth' placeholder='MM' size='2' type='text' placeholder="09">
                                </div>
                                <div class='col-sm-12 col-md-4'>
                                    <label class='control-label'>Expiration Year</label>
                                    <input class='form-control card-expiry-year' id='expiryYear' placeholder='YYYY' size='4' type='text' placeholder="2024">
                                </div>
                            </div>
                        </div>

                        <div class='row'>
                            <div class='col-md-12 error form-group hide'>
                                <div class='alert alert-danger'>Please correct the errors and try again.</div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12 btn-block">
                                <button class="btn btn-primary btn-lg" type="submit">Pay Now (${{ Session::get('ticketPrice') }})</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>        
        </div>
    </div>
</div>
  
</body>
  
<script type="text/javascript" src="https://js.stripe.com/v2/"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  
<script type="text/javascript">
$(function() {
    var $form = $(".require-validation");
   
    $('form.require-validation').on('submit', function(e) {
        var $form = $(".require-validation"),
            inputSelector = ['input[type=email]', 'input[type=password]', 'input[type=text]', 'input[type=file]', 'textarea'].join(', '),
            $inputs = $form.find('.required').find(inputSelector),
            $errorMessage = $form.find('div.error'),
            valid = true;

        $errorMessage.addClass('hide');
        $('.has-error').removeClass('has-error');

        $inputs.each(function(i, el) {
            var $input = $(el);
            if ($input.val() === '') {
                $input.parent().addClass('has-error');
                $errorMessage.removeClass('hide');
                valid = false;
            }
        });

        if (!$form.data('cc-on-file') && valid) {
            e.preventDefault();
            Stripe.setPublishableKey($form.data('stripe-publishable-key'));
            Stripe.createToken({
                number: $('.card-number').val(),
                cvc: $('.card-cvc').val(),
                exp_month: $('.card-expiry-month').val(),
                exp_year: $('.card-expiry-year').val()
            }, stripeResponseHandler);
        }
    });

    function stripeResponseHandler(status, response) {
        if (response.error) {
            $('.error')
                .removeClass('hide')
                .find('.alert')
                .text(response.error.message);
        } else {
            var token = response['id'];
            $form.find('input[type=text]').empty();
            $form.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
            $form.get(0).submit();
        }
    }
});

/* -------- For testing only --------------- */
// JavaScript to set initial values of form fields
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("nameOnCard").value = "John";
    document.getElementById("cardNumber").value = "4242424242424242";
    document.getElementById("cvc").value = "123";
    document.getElementById("expiryMonth").value = "09";
    document.getElementById("expiryYear").value = "2024";
});
/* ------------------------------------------- */
</script>
</html>
