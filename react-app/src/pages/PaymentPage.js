import React from 'react';
import { Link } from 'react-router-dom';
import '../../payment.css';
import './PaymentPage.css';

const PaymentPage = () => {
  return (
    <div className="payment-container">
      <header className="payment-header">
        <div className="header-content">
          <Link to="/" className="back-btn">
            <i className="fas fa-arrow-left"></i>
            <span>Quay lại</span>
          </Link>
          <h1>Thanh toán ngân hàng</h1>
          <div className="security-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Bảo mật</span>
          </div>
        </div>
      </header>

      <main className="payment-main">
        <section className="order-summary">
          <h2><i className="fas fa-shopping-cart"></i> Tóm tắt đơn hàng</h2>
          <div className="order-item">
            <div className="item-info">
              <h3 id="productName">Sản phẩm/Dịch vụ</h3>
              <p id="productDescription">Mô tả sản phẩm</p>
            </div>
            <div className="item-price">
              <span id="productPrice">0 VNĐ</span>
            </div>
          </div>
          <div className="order-total">
            <div className="total-row">
              <span>Tạm tính:</span>
              <span id="subtotal">20,000 VNĐ</span>
            </div>
            <div className="total-row">
              <span>Phí xử lý:</span>
              <span id="processingFee">0đ</span>
            </div>
            <div className="total-row total-final">
              <span>Tổng cộng:</span>
              <span id="totalAmount">20,000 VNĐ</span>
            </div>
          </div>
        </section>

        <section className="payment-methods">
          <h2><i className="fas fa-credit-card"></i> Phương thức thanh toán</h2>
          <div className="bank-info">
            <h3>Thông tin chuyển khoản</h3>
            <div className="bank-details">
              <div className="bank-item">
                <label>Ngân hàng:</label>
                <span>Vietinbank (VTB)</span>
              </div>
              <div className="bank-item">
                <label>Số tài khoản:</label>
                <span className="copyable" data-copy="108880790155">
                  1088 8079 0155
                  <i className="fas fa-copy"></i>
                </span>
              </div>
              <div className="bank-item">
                <label>Chủ tài khoản:</label>
                <span>LE DUC QUANG</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PaymentPage;

