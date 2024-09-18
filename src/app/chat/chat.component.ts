import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Chat {
  name: string;
  time: string;
}

interface Message {
  text: string;
  time: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  chats: Chat[] = [
    { name: 'Ahmed Joba 🦅', time: '09:24 PM' },
    { name: 'Ahmed Tarek ♥️👬', time: '09:24 PM' },
    { name: 'Youssef Makhlouf 💪👬', time: '09:24 PM' },
    { name: 'Tarek Ahmed  ♥️', time: '09:24 PM' },
    { name: 'nour', time: '09:24 PM' },
    { name: 'abdo', time: '09:24 PM' },
    { name: 'hend', time: '09:24 PM' },
  ];

  filteredChats: Chat[] = [...this.chats];
  searchText = '';
  messages: Message[] = [];
  selectedChat: Chat | null = this.chats[0];
  messageText = '';

  modalImage: string | null = null; // لإدارة النافذة المنبثقة للصور

  // تصفية الدردشات
  filterChats() {
    this.filteredChats = this.chats.filter((chat) =>
      chat.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // اختيار الدردشة
  selectChat(chat: Chat) {
    this.selectedChat = chat;
  }

  // إرسال الرسائل
  sendMessage() {
    if (this.messageText.trim()) {
      const newMessage: Message = {
        text: this.messageText,
        time: new Date().toLocaleTimeString(),
      };
      this.messages.push(newMessage);

      // تحديث الوقت في الـ Sidebar
      if (this.selectedChat) {
        this.selectedChat.time = newMessage.time;
      }

      this.messageText = '';

      // التمرير التلقائي عند إضافة رسالة جديدة
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  // التمرير التلقائي لأسفل
  scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // فتح نافذة رفع الملفات
  triggerFileUpload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // التعامل مع الملف المرفوع
  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.messages.push({
          text: '',
          time: new Date().toLocaleTimeString(),
          imageUrl: reader.result as string,
        });

        // تحديث الوقت في الـ Sidebar عند إرسال صورة
        if (this.selectedChat) {
          this.selectedChat.time = new Date().toLocaleTimeString();
        }

        setTimeout(() => this.scrollToBottom(), 0); // التمرير التلقائي بعد إضافة الصورة
      };
      reader.readAsDataURL(file);
    }
  }

  // إضافة خاصية الإرسال عند الضغط على Enter
  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  // فتح النافذة المنبثقة للصورة
  openImageModal(imageUrl: string) {
    this.modalImage = imageUrl;
  }

  // غلق النافذة المنبثقة للصورة
  closeImageModal() {
    this.modalImage = null;
  }
}
