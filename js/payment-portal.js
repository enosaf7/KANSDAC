document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const paymentTypeCards = document.querySelectorAll('.payment-type-card');
    let selectedPaymentType = null;
    const paystack = new PaystackPop();

    // Show loading spinner
    function showLoading() {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
    }

    // Hide loading spinner
    function hideLoading() {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Pay';
        submitBtn.disabled = false;
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        paymentForm.insertBefore(errorDiv, paymentForm.firstChild);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Handle payment type selection
    paymentTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            paymentTypeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedPaymentType = this.dataset.type;
        });
    });

    // Handle form submission
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const amount = document.getElementById('amount').value;
        const email = document.getElementById('email').value || 'anonymous@example.com';
        const selectedPaymentType = document.querySelector('.payment-type-card.selected')?.dataset.type;
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;

        // Validation checks
        if (!selectedPaymentType) {
            alert('Please select a payment type (Tithe, Offering, etc.)');
            return;
        }

        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            console.log('Starting transaction with:', {
                amount,
                email,
                paymentType: selectedPaymentType,
                paymentMethod: selectedPaymentMethod
            });

            const paystack = new PaystackPop();
            paystack.newTransaction({
                key: 'YOUR_PAYSTACK_PUBLIC_KEY', // Double check this is correct
                email: email,
                amount: Math.round(amount * 100), // Ensure amount is an integer
                currency: 'GHS',
                channels: [selectedPaymentMethod], // Restrict to selected payment method
                metadata: {
                    payment_type: selectedPaymentType
                },
                onSuccess: function(transaction) {
                    console.log('Transaction successful:', transaction);
                    alert('Payment successful! Thank you for your contribution.');
                },
                onCancel: function() {
                    console.log('Transaction cancelled by user');
                    alert('Transaction cancelled.');
                }
            });
        } catch (error) {
            console.error('Payment error:', error);
            alert(`Payment failed: ${error.message}`);
        }
    });

    async function verifyPayment(reference) {
        try {
            const response = await fetch(`http://localhost:5000/api/verify-payment/${reference}`);
            const data = await response.json();

            if (data.status === 'success') {
                // Show success message and redirect
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Payment Successful!</h3>
                    <p>Thank you for your contribution.</p>
                `;
                document.querySelector('.payment-container').appendChild(successMessage);

                setTimeout(() => {
                    window.location.href = '/payment-success.html';
                }, 2000);
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            showError('Payment verification failed. Please contact support.');
        } finally {
            hideLoading();
        }
    }
});