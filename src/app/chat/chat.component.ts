import {
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat, Message, Sender } from '../models/IChat';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore'; // استيراد Firestore والدوال اللازمة

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  [x: string]: any;
  chats: any = [];
  lasestMessage: Message | null = null;
  searchText = '';
  selectedChatId: string | null = null;
  selectBuyerChat: any = {};
  content = '';
  message: string = '';
  messages: any = [];
  modalImage: string | null = null;
  isSidebarVisible: boolean = true; // Controls visibility of the sidebar on mobile
  screenWidth: number;
  sellerId!: string;
  @ViewChild('containerRef') containerRef!: ElementRef;

  constructor(
    private firestore: Firestore, // استخدام Firestore
    private _profileService: ProfileService
  ) {
    this.screenWidth = window.innerWidth; // Initialize the screen width
  }

  ngAfterViewInit() {
    this.backToBottom();
  }

  ngOnInit(): void {
    this._profileService.getProfileData().subscribe((res) => {
      this.sellerId = res._id;
      this.getChatsForWorkshop();
    });

    // تأكد من استدعاء الدالة لجلب المحادثات عند التحميل
  }

  getChatsForWorkshop() {
    const chatsRef = collection(this.firestore, 'chats'); // مرجع لمجموعة المحادثات

    const q = query(
      chatsRef,
      where('sellerId', '==', this.sellerId),
      orderBy('timestamp', 'desc')
    );

    onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          this.chats = [];
        } else {
          this.chats = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('chats arrived');
        }
      },
      (error) => {
        console.error('Error getting real-time updates: ', error);
      }
    );
  }

  isMobile(): boolean {
    return this.screenWidth < 768;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  hasKeys(obj: any): boolean {
    return obj && Object.keys(obj).length > 0;
  }

  scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  selectChat(chat: any) {
    this.selectedChatId = chat.id;
    this.selectBuyerChat = chat;
    this.getMessagesForChat(chat.id);
    this.backToBottom();
    this.markMessagesAsRead(chat.id);
  }

  markMessagesAsRead(chatId: string) {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    const q = query(messagesRef, where('isRead', '==', false));

    onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            isRead: true,
          }).catch((error) => {
            console.error('Error updating message: ', error);
          });
        });

        updateDoc(chatRef, {
          'lastMessage.isRead': true,
        })
          .then(() => {
            console.log('Last message marked as read');
          })
          .catch((error) => {
            console.error('Error updating last message: ', error);
          });
      }
    });
  }

  getMessagesForChat(chatId: string) {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);

    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    onSnapshot(
      q,
      (snapshot) => {
        this.messages = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...Object.assign({}, doc.data()),
          };
        });
        this.backToBottom();
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (!this.content || this.content.trim() === '') {
      return;
    }

    const chatId = this.selectBuyerChat.id;
    const message = {
      content: this.content,
      senderId: this.sellerId,
      timestamp: new Date(),
      read: false,
    };

    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const chatRef = doc(this.firestore, `chats/${chatId}`);

    addDoc(messagesRef, message)
      .then(() => {
        console.log('Message sent successfully!');
        return updateDoc(chatRef, {
          lastMessage: {
            text: this.content || 'Image Sent 📸',
            timestamp: new Date(),
            sender: this.sellerId,
          },
          timestamp: new Date(),
        });
      })
      .then(() => {
        this.content = '';
        setTimeout(() => {
          this.backToBottom();
        }, 200);
      })
      .catch((error) => {
        console.error('Error sending message: ', error);
      });
  }

  backToBottom() {
    if (this.containerRef) {
      this.containerRef.nativeElement.scrollTop =
        this.containerRef.nativeElement.scrollHeight;
    }
  }
}
