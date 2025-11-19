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

        // Lưu prompt key nếu có
        const promptKey = samplePrompts.find(p => p.text === inputMessage) ? .key || 'CUSTOM';

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

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                text: 'Cảm ơn bạn đã liên hệ! Tôi đã nhận được tin nhắn của bạn. Đội ngũ hỗ trợ sẽ phản hồi sớm nhất có thể.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
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
        span className = "chat-status" > Đang trực tuyến < /span> <
        /div> <
        /div> <
        button className = "close-btn"
        onClick = {
            onClose
        } >
        <
        i className = "fas fa-times" > < /i> <
        /button> <
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
                p > {
                    message.text
                } < /p> <
                span className = "message-time" > {
                    formatTime(message.timestamp)
                } < /span> <
                /div> <
                /div>
            ))
        } <
        div ref = {
            messagesEndRef
        }
        /> <
        /div>

        {
            /* Prompt mẫu */ } {
            showPrompts && messages.length <= 1 && ( <
                div className = "chat-prompts" >
                <
                div className = "prompts-header" >
                <
                i className = "fas fa-bolt" > < /i> <
                span > Chọn nhanh: < /span> <
                /div> <
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
                        } < /span> <
                        /button>
                    ))
                } <
                /div> <
                /div>
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
        i className = "fas fa-paper-plane" > < /i> <
        /button> <
        /div> <
        /form> <
        /div> <
        /div>
    );
};

export default ChatModal;