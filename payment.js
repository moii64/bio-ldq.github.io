/**
 * Payment Page JavaScript
 * Handles payment form interactions and URL parameters
 */

class PaymentHandler {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.loadOrderData();
        this.setupEventListeners();
        this.generateOrderCode();
        this.updatePaymentAmounts();

        console.log('✅ Payment Handler initialized');
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }
        }, 1000);
    }

    loadOrderData() {
        // Get data from URL parameters
        const productName = this.urlParams.get('product') || 'Sản phẩm/Dịch vụ';
        const productDescription = this.urlParams.get('description') || 'Mô tả sản phẩm';
        const price = parseFloat(this.urlParams.get('price')) || 0;
        const code = this.urlParams.get('code') || this.generateOrderCode();

        // Update product info
        document.getElementById('productName').textContent = productName;
        document.getElementById('productDescription').textContent = productDescription;
        document.getElementById('productPrice').textContent = this.formatCurrency(price);
        document.getElementById('orderCode').textContent = code;

        // Store order data
        this.orderData = {
            productName,
            productDescription,
            price,
            code,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage for reference
        localStorage.setItem('currentOrder', JSON.stringify(this.orderData));
    }

    generateOrderCode() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `TT${timestamp.toUpperCase()}${random.toUpperCase()}`;
    }

    updatePaymentAmounts() {
        // Check for discount codes
        const discountCode = 20000;
        let price = 20000;
        let discountAmount = 0;
        let finalPrice = price;

        if (discountCode) {
            const discount = this.applyDiscount(discountCode, price);
            if (discount) {
                discountAmount = discount.amount;
                finalPrice = discount.finalPrice;
            }
        }

        const processingFee = 0; // No processing fee
        const total = finalPrice;

        // Update display
        document.getElementById('subtotal').textContent = this.formatCurrency(price);
        document.getElementById('processingFee').textContent = '0đ';
        document.getElementById('totalAmount').textContent = this.formatCurrency(total);

        // Show discount info if applicable
        this.updateDiscountDisplay(discountCode, discountAmount, finalPrice);

        // Update QR codes with actual amount
        this.updateQRCodes(total);
    }

    getDiscountCode() {
        // Check URL parameters for discount code
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('discount') || urlParams.get('code');
    }

    applyDiscount(code, originalPrice) {
        const discounts = {
            'VIP2024': {
                amount: 5000,
                type: 'fixed',
                description: 'Giảm 5,000đ'
            },
            'SPECIAL50': {
                amount: 10000,
                type: 'fixed',
                description: 'Giảm 10,000đ'
            },
            'MASTER100': {
                amount: 5000,
                type: 'fixed',
                description: 'Giảm 5,000đ'
            },
            'PREMIUM75': {
                amount: 10000,
                type: 'fixed',
                description: 'Giảm 10,000đ'
            },
            'ELITE90': {
                amount: 5000,
                type: 'fixed',
                description: 'Giảm 5,000đ'
            }
        };

        const discount = discounts[code];
        if (!discount) return null;

        const finalPrice = Math.max(0, originalPrice - discount.amount);

        return {
            code: code,
            amount: discount.amount,
            finalPrice: finalPrice,
            description: discount.description
        };
    }

    updateDiscountDisplay(code, discountAmount, finalPrice) {
        const discountContainer = document.getElementById('discount-info');
        const discountInput = document.getElementById('discountCode');

        if (!discountContainer) return;

        if (code && discountAmount > 0) {
            discountContainer.innerHTML = `
                <div class="discount-item">
                    <span class="discount-label">Mã giảm giá:</span>
                    <span class="discount-code">${code}</span>
                </div>
                <div class="discount-item">
                    <span class="discount-label">Giảm giá:</span>
                    <span class="discount-amount">-${this.formatCurrency(discountAmount)}</span>
                </div>
            `;
            discountContainer.style.display = 'block';

            // Update input field
            if (discountInput) {
                discountInput.value = code;
            }
        } else {
            discountContainer.style.display = 'none';

            // Clear input field
            if (discountInput) {
                discountInput.value = '';
            }
        }
    }

    removeDiscount() {
        // Clear URL parameter
        const url = new URL(window.location);
        url.searchParams.delete('discount');
        window.history.replaceState({}, '', url);

        // Clear input
        const discountInput = document.getElementById('discountCode');
        if (discountInput) {
            discountInput.value = '';
        }

        // Update payment amounts
        this.updatePaymentAmounts();

        // Show toast for manual removal
        this.showToast('Đã xóa mã giảm giá', 'info');
    }

    updateQRCodes(amount) {
        try {
            // Validate amount
            if (!amount || amount <= 0) {
                console.error('Invalid amount provided for QR generation');
                return;
            }

            const orderCode = this.orderData && this.orderData.code || 'ORDER123';

            // Update static QR codes with amount info
            this.updateBankQR(amount, orderCode);
            this.updateMoMoQR(amount, orderCode);
            this.updateZaloPayQR(amount, orderCode);

        } catch (error) {
            console.error('Error updating QR codes:', error);
        }
    }

    updateBankQR(amount, orderCode) {
        // Vietinbank QR is static - just update the display info
        const amountInfo = document.getElementById('bankAmountInfo');
        if (amountInfo) {
            amountInfo.innerHTML = `
                <div class="amount-display">${this.formatCurrency(amount)}</div>
                <div class="order-code">Mã: ${orderCode}</div>
            `;
        }
    }

    updateMoMoQR(amount, orderCode) {
        // MoMo QR is static - just update the display info
        const amountInfo = document.getElementById('momoAmountInfo');
        if (amountInfo) {
            amountInfo.innerHTML = `
                <div class="amount-display">${this.formatCurrency(amount)}</div>
                <div class="order-code">Mã: ${orderCode}</div>
            `;
        }
    }

    updateZaloPayQR(amount, orderCode) {
        // ZaloPay QR is now static - just update the display info
        const amountInfo = document.getElementById('zalopayAmountInfo');
        if (amountInfo) {
            amountInfo.innerHTML = `
                <div class="amount-display">${this.formatCurrency(amount)}</div>
                <div class="order-code">Mã: ${orderCode}</div>
            `;
        }
    }


    setupEventListeners() {
        // Payment method tabs
        const methodTabs = document.querySelectorAll('.method-tab');
        methodTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchPaymentMethod(tab.dataset.method);
            });
        });

        // Copy buttons
        const copyableElements = document.querySelectorAll('.copyable');
        copyableElements.forEach(element => {
            element.addEventListener('click', () => {
                this.copyToClipboard(element.dataset.copy);
            });
        });

        // Discount form
        this.setupDiscountForm();

        // Contact links
        this.setupContactLinks();
    }

    setupDiscountForm() {
        const discountInput = document.getElementById('discountCode');
        const applyBtn = document.getElementById('applyDiscount');

        if (!discountInput || !applyBtn) return;

        // Apply discount on button click
        applyBtn.addEventListener('click', () => {
            this.applyDiscountCode();
        });

        // Apply discount on Enter key
        discountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyDiscountCode();
            }
        });

        // Clear discount info when typing new code
        discountInput.addEventListener('input', () => {
            const discountInfo = document.getElementById('discount-info');
            if (discountInfo && discountInfo.style.display !== 'none') {
                discountInfo.style.display = 'none';
                // Don't update payment amounts here, wait for apply
            }
        });

        // Clear discount when input is empty and user leaves field
        discountInput.addEventListener('blur', () => {
            const code = discountInput.value.trim();
            if (!code) {
                this.removeDiscount();
            }
        });

        // Allow manual input and clear
        discountInput.addEventListener('keydown', (e) => {
            // Allow all normal input (letters, numbers, backspace, delete, etc.)
            if (e.key === 'Escape') {
                // Clear on Escape key
                discountInput.value = '';
                this.removeDiscount();
            }
        });
    }

    applyDiscountCode() {
        const discountInput = document.getElementById('discountCode');
        const applyBtn = document.getElementById('applyDiscount');

        if (!discountInput || !applyBtn) return;

        const code = discountInput.value.trim().toUpperCase();

        if (!code) {
            this.showToast('Vui lòng nhập mã giảm giá', 'error');
            return;
        }

        // Disable button during processing
        applyBtn.disabled = true;
        applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

        // Simulate processing delay
        setTimeout(() => {
            const discount = this.applyDiscount(code, 20000);

            if (discount) {
                // Update URL with discount code
                const url = new URL(window.location);
                url.searchParams.set('discount', code);
                window.history.replaceState({}, '', url);

                // Update payment amounts
                this.updatePaymentAmounts();

                this.showToast(`Áp dụng mã ${code} thành công!`, 'success');
            } else {
                this.showToast('Mã giảm giá không hợp lệ', 'error');
                // Clear input on invalid code
                discountInput.value = '';
            }

            // Re-enable button
            applyBtn.disabled = false;
            applyBtn.innerHTML = '<i class="fas fa-check"></i> Áp dụng';
        }, 1000);
    }

    switchPaymentMethod(method) {
        // Update tabs
        document.querySelectorAll('.method-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');

        // Update payment methods
        document.querySelectorAll('.payment-method').forEach(methodEl => {
            methodEl.classList.remove('active');
        });
        document.getElementById(`${method}-method`).classList.add('active');

        // Show success message
        this.showToast(`Đã chọn ${this.getMethodName(method)}`, 'success');
    }

    getMethodName(method) {
        const names = {
            'bank': 'Chuyển khoản ngân hàng',
            'momo': 'Ví MoMo',
            'zalopay': 'ZaloPay'
        };
        return names[method] || method;
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Đã sao chép vào clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Đã sao chép vào clipboard!', 'success');
        }
    }

    setupContactLinks() {
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');

                if (href.startsWith('tel:')) {
                    window.location.href = href;
                } else if (href.startsWith('https://zalo.me/')) {
                    this.openZalo(href);
                } else if (href.startsWith('https://m.me/')) {
                    this.openMessenger(href);
                }
            });
        });
    }

    openZalo(zaloUrl) {
        // Try to open Zalo app first
        const zaloAppUrl = zaloUrl.replace('https://zalo.me/', 'zalo://');
        window.location.href = zaloAppUrl;

        // Fallback to web after 2 seconds
        setTimeout(() => {
            window.open(zaloUrl, '_blank');
        }, 2000);
    }

    openMessenger(messengerUrl) {
        window.open(messengerUrl, '_blank');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Public method to get order data
    getOrderData() {
        return this.orderData;
    }

    // Method to validate payment
    validatePayment(amount, reference) {
        // This would typically connect to your payment gateway
        // For demo purposes, we'll simulate validation
        return new Promise((resolve) => {
            setTimeout(() => {
                const isValid = amount === this.orderData.price && reference.includes(this.orderData.code);
                resolve(isValid);
            }, 1000);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.paymentHandler = new PaymentHandler();
    });
} else {
    window.paymentHandler = new PaymentHandler();
}

// Export for use in other scripts
window.PaymentHandler = PaymentHandler;
window.PaymentHandler = PaymentHandler;