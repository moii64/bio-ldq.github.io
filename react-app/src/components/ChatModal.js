import React, {
    useState,
    useRef,
    useEffect
} from 'react';
import './ChatModal.css';

const ChatModal = ({
    onClose
}) => {
    const [messages, setMessages] = useState([{
        id: 1,
        text: 'Xin chào! Tôi là AI Support của Agenl. Tôi có thể giúp gì cho bạn?',
        sender: 'ai',
        timestamp: new Date()
    }]);
    const [inputMessage, setInputMessage] = useState('');
    const [showPrompts, setShowPrompts] = useState(true);
    const messagesEndRef = useRef(null);

    // Các prompt mẫu với key để CS nhận dạng
    const samplePrompts = [{
            key: 'TECH_SUPPORT',
            text: 'Tôi cần hỗ trợ kỹ thuật',
            icon: 'fas fa-tools'
        },
        {
            key: 'PAYMENT_ISSUE',
            text: 'Câu hỏi về thanh toán',
            icon: 'fas fa-credit-card'
        },
        {
            key: 'BUG_REPORT',
            text: 'Báo lỗi / Sự cố',
            icon: 'fas fa-bug'
        },
        {
            key: 'FEATURE_REQUEST',
            text: 'Yêu cầu tính năng mới',
            icon: 'fas fa-lightbulb'
        },
        {
            key: 'ACCOUNT_HELP',
            text: 'Hỗ trợ tài khoản',
            icon: 'fas fa-user-circle'
        },
        {
            key: 'GENERAL_QUESTION',
            text: 'Câu hỏi chung',
            icon: 'fas fa-question-circle'
        }
    ];

    // Hàm tạo phản hồi tự động dựa trên prompt key và nội dung
    const generateAutoResponse = (promptKey, userMessage) => {
        const messageLower = userMessage.toLowerCase();

        // Phản hồi theo prompt key
        switch (promptKey) {
            case 'TECH_SUPPORT':
                if (messageLower.includes('đăng nhập') || messageLower.includes('login')) {
                    return 'Về vấn đề đăng nhập, bạn vui lòng:\n1. Kiểm tra lại email và mật khẩu\n2. Thử quên mật khẩu nếu cần\n3. Xóa cache trình duyệt và thử lại\n\nNếu vẫn không được, vui lòng cung cấp thêm thông tin để chúng tôi hỗ trợ tốt hơn.';
                }
                if (messageLower.includes('lỗi') || messageLower.includes('error') || messageLower.includes('bug')) {
                    return 'Cảm ơn bạn đã báo lỗi! Để chúng tôi xử lý nhanh nhất:\n1. Mô tả chi tiết lỗi bạn gặp phải\n2. Chụp màn hình nếu có thể\n3. Cho biết bạn đang sử dụng trình duyệt/thiết bị gì\n\nChúng tôi sẽ xử lý ngay khi nhận được thông tin.';
                }
                return 'Cảm ơn bạn đã liên hệ về hỗ trợ kỹ thuật! Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải:\n- Bạn đang làm gì khi gặp lỗi?\n- Thông báo lỗi hiển thị như thế nào?\n- Vấn đề xảy ra từ khi nào?\n\nChúng tôi sẽ phản hồi trong thời gian sớm nhất.';

            case 'PAYMENT_ISSUE':
                if (messageLower.includes('hoàn tiền') || messageLower.includes('refund')) {
                    return 'Về yêu cầu hoàn tiền:\n- Chúng tôi sẽ xử lý trong vòng 5-7 ngày làm việc\n- Tiền sẽ được hoàn về phương thức thanh toán ban đầu\n- Bạn sẽ nhận được email xác nhận khi hoàn tất\n\nVui lòng cung cấp mã đơn hàng để chúng tôi kiểm tra.';
                }
                if (messageLower.includes('thanh toán') || messageLower.includes('payment') || messageLower.includes('mua')) {
                    return 'Về vấn đề thanh toán:\n- Chúng tôi hỗ trợ nhiều phương thức: thẻ tín dụng, chuyển khoản, ví điện tử\n- Nếu gặp lỗi khi thanh toán, vui lòng thử lại hoặc dùng phương thức khác\n- Kiểm tra số dư tài khoản của bạn\n\nVui lòng cho biết phương thức thanh toán bạn đang sử dụng.';
                }
                return 'Cảm ơn bạn đã liên hệ về vấn đề thanh toán! Vui lòng cung cấp:\n- Mã đơn hàng (nếu có)\n- Phương thức thanh toán bạn đã sử dụng\n- Mô tả vấn đề cụ thể\n\nChúng tôi sẽ kiểm tra và phản hồi ngay.';

            case 'BUG_REPORT':
                return 'Cảm ơn bạn đã báo lỗi! Để chúng tôi xử lý hiệu quả, vui lòng cung cấp:\n\n📋 Thông tin cần thiết:\n1. Mô tả chi tiết lỗi\n2. Các bước để tái hiện lỗi\n3. Chụp màn hình/ảnh minh họa\n4. Trình duyệt và phiên bản đang dùng\n5. Thời điểm lỗi xảy ra\n\nChúng tôi sẽ ưu tiên xử lý và cập nhật cho bạn sớm nhất.';

            case 'FEATURE_REQUEST':
                return 'Cảm ơn bạn đã đề xuất tính năng mới! Ý tưởng của bạn rất quan trọng với chúng tôi.\n\nVui lòng mô tả:\n- Tính năng bạn muốn thêm là gì?\n- Lợi ích của tính năng này?\n- Cách bạn muốn sử dụng nó?\n\nĐội ngũ phát triển sẽ xem xét và có thể triển khai trong các phiên bản tới.';

            case 'ACCOUNT_HELP':
                if (messageLower.includes('đổi mật khẩu') || messageLower.includes('password')) {
                    return 'Để đổi mật khẩu:\n1. Vào Cài đặt tài khoản\n2. Chọn "Đổi mật khẩu"\n3. Nhập mật khẩu cũ và mật khẩu mới\n4. Xác nhận thay đổi\n\nNếu quên mật khẩu, sử dụng chức năng "Quên mật khẩu" trên trang đăng nhập.';
                }
                if (messageLower.includes('xóa') || messageLower.includes('delete')) {
                    return 'Về yêu cầu xóa tài khoản:\n- Chúng tôi rất tiếc khi bạn muốn rời đi\n- Tài khoản sẽ bị xóa vĩnh viễn sau 30 ngày\n- Bạn có thể hủy yêu cầu trong thời gian này\n\nVui lòng xác nhận lại yêu cầu của bạn.';
                }
                return 'Về hỗ trợ tài khoản, chúng tôi có thể giúp bạn:\n- Đổi thông tin cá nhân\n- Quản lý mật khẩu\n- Cài đặt bảo mật\n- Vấn đề đăng nhập\n\nVui lòng cho biết bạn cần hỗ trợ về vấn đề gì cụ thể?';

            case 'GENERAL_QUESTION':
                return 'Cảm ơn bạn đã liên hệ! Chúng tôi sẵn sàng trả lời mọi câu hỏi của bạn.\n\nVui lòng đặt câu hỏi cụ thể để chúng tôi có thể hỗ trợ bạn tốt nhất. Bạn có thể hỏi về:\n- Hướng dẫn sử dụng\n- Chính sách dịch vụ\n- Giá cả và gói dịch vụ\n- Hoặc bất kỳ thắc mắc nào khác';

            default:
                // Phân tích nội dung tin nhắn để phản hồi thông minh
                if (messageLower.includes('cảm ơn') || messageLower.includes('thank')) {
                    return 'Không có gì! Rất vui được hỗ trợ bạn. Nếu cần thêm gì, đừng ngần ngại liên hệ nhé! 😊';
                }
                if (messageLower.includes('xin chào') || messageLower.includes('hello') || messageLower.includes('hi')) {
                    return 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?';
                }
                if (messageLower.includes('giá') || messageLower.includes('price') || messageLower.includes('cost')) {
                    return 'Về giá cả, chúng tôi có nhiều gói dịch vụ phù hợp với nhu cầu khác nhau. Bạn có thể xem chi tiết tại trang thanh toán hoặc cho tôi biết nhu cầu của bạn để tôi tư vấn gói phù hợp nhất.';
                }
                return 'Cảm ơn bạn đã liên hệ! Tôi đã nhận được tin nhắn của bạn. Đội ngũ hỗ trợ sẽ phản hồi sớm nhất có thể. Trong thời gian chờ, bạn có thể:\n- Xem FAQ tại trang chủ\n- Kiểm tra email để nhận thông báo\n- Liên hệ lại nếu cần hỗ trợ khẩn cấp';
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current ? .scrollIntoView({
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Tìm prompt key từ nội dung hoặc prompt mẫu
        let promptKey = 'CUSTOM';
        const matchedPrompt = samplePrompts.find(p => p.text === inputMessage);
        if (matchedPrompt) {
            promptKey = matchedPrompt.key;
        } else {
            // Phân tích nội dung để xác định prompt key
            const messageLower = inputMessage.toLowerCase();
            if (messageLower.includes('kỹ thuật') || messageLower.includes('lỗi') || messageLower.includes('error') || messageLower.includes('bug')) {
                promptKey = 'TECH_SUPPORT';
            } else if (messageLower.includes('thanh toán') || messageLower.includes('payment') || messageLower.includes('mua') || messageLower.includes('hoàn tiền')) {
                promptKey = 'PAYMENT_ISSUE';
            } else if (messageLower.includes('tính năng') || messageLower.includes('feature') || messageLower.includes('yêu cầu')) {
                promptKey = 'FEATURE_REQUEST';
            } else if (messageLower.includes('tài khoản') || messageLower.includes('account') || messageLower.includes('đăng nhập')) {
                promptKey = 'ACCOUNT_HELP';
            }
        }

        // Thêm tin nhắn của user với metadata
        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
            promptKey: promptKey
        };
        setMessages([...messages, userMessage]);
        setInputMessage('');
        setShowPrompts(false);

        // Lưu vào localStorage để CS truy xuất
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        chatHistory.push({
            message: inputMessage,
            promptKey: promptKey,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        // Tạo phản hồi tự động thông minh
        const delay = 800 + Math.random() * 700; // Delay 0.8-1.5s để tự nhiên hơn
        setTimeout(() => {
            const aiResponseText = generateAutoResponse(promptKey, inputMessage);
            const aiResponse = {
                id: messages.length + 2,
                text: aiResponseText,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        }, delay);
    };

    const handlePromptClick = (prompt) => {
        setInputMessage(prompt.text);
        setShowPrompts(false);
        // Tự động gửi sau khi điền
        setTimeout(() => {
            const fakeEvent = {
                preventDefault: () => {}
            };
            setInputMessage(prompt.text);
            handleSend(fakeEvent);
        }, 100);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return ( <
        div className = "chat-modal show"
        onClick = {
            onClose
        } >
        <
        div className = "chat-modal-content"
        onClick = {
            (e) => e.stopPropagation()
        } >
        <
        div className = "chat-modal-header" >
        <
        div className = "chat-header-info" >
        <
        i className = "fas fa-headset" > < /i> <
        div >
        <
        h3 > Agenl AI Support < /h3> <
        span className = "chat-status" > Đang trực tuyến < /span> < /
        div > <
        /div> <
        button className = "close-btn"
        onClick = {
            onClose
        } >
        <
        i className = "fas fa-times" > < /i> < /
        button > <
        /div>

        <
        div className = "chat-messages"
        id = "chatMessages" > {
            messages.map((message) => ( <
                div key = {
                    message.id
                }
                className = {
                    `chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`
                } >
                <
                div className = "message-content" >
                <
                p style = {
                    {
                        whiteSpace: 'pre-line'
                    }
                } > {
                    message.text
                } < /p> <
                span className = "message-time" > {
                    formatTime(message.timestamp)
                } < /span> < /
                div > <
                /div>
            ))
        } <
        div ref = {
            messagesEndRef
        }
        /> < /
        div >

        {
            /* Prompt mẫu */
        } {
            showPrompts && messages.length <= 1 && ( <
                div className = "chat-prompts" >
                <
                div className = "prompts-header" >
                <
                i className = "fas fa-bolt" > < /i> <
                span > Chọn nhanh: < /span> < /
                div > <
                div className = "prompts-list" > {
                    samplePrompts.map((prompt, index) => ( <
                        button key = {
                            index
                        }
                        type = "button"
                        className = "prompt-btn"
                        onClick = {
                            () => handlePromptClick(prompt)
                        } >
                        <
                        i className = {
                            prompt.icon
                        } > < /i> <
                        span > {
                            prompt.text
                        } < /span> < /
                        button >
                    ))
                } <
                /div> < /
                div >
            )
        }

        <
        form className = "chat-input-form"
        onSubmit = {
            handleSend
        } >
        <
        div className = "chat-input-container" >
        <
        input type = "text"
        className = "chat-input"
        placeholder = "Nhập tin nhắn của bạn..."
        value = {
            inputMessage
        }
        onChange = {
            (e) => {
                setInputMessage(e.target.value);
                if (e.target.value.trim()) {
                    setShowPrompts(false);
                } else if (messages.length <= 1) {
                    setShowPrompts(true);
                }
            }
        }
        onFocus = {
            () => {
                if (!inputMessage.trim() && messages.length <= 1) {
                    setShowPrompts(true);
                }
            }
        }
        autoFocus /
        >
        <
        button type = "submit"
        className = "chat-send-btn"
        disabled = {
            !inputMessage.trim()
        } >
        <
        i className = "fas fa-paper-plane" > < /i> < /
        button > <
        /div> < /
        form > <
        /div> < /
        div >
    );
};

export default ChatModal;