<!DOCTYPE html>
<html>
<head>
    <title>Laravel 10 - Stripe Payment Gateway Integration Tutorial Example - Tutsmake.com</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

    <style type="text/css">
        /* Custom CSS to center the panel */
        body, html {
            height: 100%;
        }
        .container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        /* Other styles from your original code */
        .panel-title {
            font-weight: bold;
        }
        .display-table {
            display: table;
        }
        .display-tr {
            display: table-row;
        }
        .display-td {
            display: table-cell;
            vertical-align: middle;
            width: 61%;
        }
    </style>
</head>
<body>
  
<div class="container">
    <div class="row">
        <div class="col-md-9">
            <div class="panel panel-default credit-card-box">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-xs-8">
                            <h3 class="panel-title">Payment Details</h3>
                        </div>
                        <div class="col-xs-4 text-right">
                            <img class="img-responsive" src="http://i76.imgup.net/accepted_c22e0.png">
                        </div>
                    </div>
                </div>
                <div class="panel-body">
                    @if (Session::has('error') || Session::has('success'))
                        <div class="alert text-center {{ Session::has('success') ? 'alert-success' : 'alert-danger' }}">
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
                            <input class='form-control' size='4' type='text'>
                        </div>

                        <div class='form-group card required'>
                            <label class='control-label'>Card Number</label>
                            <input autocomplete='off' class='form-control card-number' size='20' type='text'>
                        </div>

                        <div class='form-group'>
                            <div class='row'>
                                <div class='col-xs-4 col-md-4'>
                                    <label class='control-label'>CVC</label>
                                    <input autocomplete='off' class='form-control card-cvc' placeholder='ex. 311' size='4' type='text'>
                                </div>
                                <div class='col-xs-4 col-md-4'>
                                    <label class='control-label'>Expiration Month</label>
                                    <input class='form-control card-expiry-month' placeholder='MM' size='2' type='text'>
                                </div>
                                <div class='col-xs-4 col-md-4'>
                                    <label class='control-label'>Expiration Year</label>
                                    <input class='form-control card-expiry-year' placeholder='YYYY' size='4' type='text'>
                                </div>
                            </div>
                        </div>

                        <div class='row'>
                            <div class='col-md-12 error form-group hide'>
                                <div class='alert alert-danger'>Please correct the errors and try again.</div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-12">
                                <button class="btn btn-primary btn-lg btn-block" type="submit">Pay Now ($100)</button>
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
</script>
</html>
