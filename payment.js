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

        const price = this.orderData && this.orderData.price || 0;
        const processingFee = Math.round(price * 0.03); // 3% processing fee
        const total = price + processingFee;

        document.getElementById('subtotal').textContent = this.formatCurrency(price);
        document.getElementById('processingFee').textContent = this.formatCurrency(processingFee);
        document.getElementById('totalAmount').textContent = this.formatCurrency(total);

        // Update QR codes with actual amount
        this.updateQRCodes(total);
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

        // Contact links
        this.setupContactLinks();
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