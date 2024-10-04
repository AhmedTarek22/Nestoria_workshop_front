import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Chat, Message } from '../models/IChat';
import {io} from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private apiUrl = 'http://localhost:5000/api/v1/fur/chat';
  private messageUrl = 'http://localhost:5000/api/v1/fur/message';
  // public userId: string | null = '';
  public socket:any;
  chats :Chat[]=[]
   private chatsSubject: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
   public chats$: Observable<Chat[]> = this.chatsSubject.asObservable();
   private messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
   public messages$: Observable<Message[]> = this.messagesSubject.asObservable();
//   constructor(private http: HttpClient) { 

//   this.socket   = io('http://localhost:5000', {
//     transports: ['websocket', 'polling'],
//     withCredentials: true,
//     autoConnect: true,
//     reconnection: true, // تمكين إعادة المحاولة
//     reconnectionAttempts: 5, // عدد محاولات إعادة الاتصال
//     reconnectionDelay: 5000 // مدة الانتظار بين كل محاولة
//   });
// this.initializeSocket();}
constructor(
  private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: object // حقن الـ platformId
) {
  // تحقق من أن الكود يعمل فقط في المتصفح
  if (isPlatformBrowser(this.platformId)) {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
      reconnection: true, // تمكين إعادة المحاولة
      reconnectionAttempts: 5, // عدد محاولات إعادة الاتصال
      reconnectionDelay: 5000 // مدة الانتظار بين كل محاولة
    });
    this.initializeSocket();
  }
}
initializeSocket() {
  // التأكد من أن socket يعمل فقط في بيئة المتصفح
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  console.log('Initializing socket...');
  this.socket.on('connected', () => {
    console.log('Socket connected');
  });

  this.socket.on('receive message', (newMessage: Message) => {
    this.handleNewMessage(newMessage);
  });

  // استمع لتحديثات المحادثات
  this.socket.on('refresh chats', (updatedChats: Chat[]) => {
    console.log('Chats updated on the client:', updatedChats);
    this.chatsSubject.next(updatedChats);
  });

  this.socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  this.socket.on('connect_error', (error: any) => {
    console.error('Connection Error:', error);
  });
}
// initializeSocket() {
 
//   console.log('Socket connected',this.socket);
//   console.log("Initializing socket...");
//   this.socket.on('connected', () => {
//     console.log('Socket connected');
//   });
  

//   this.socket.on('receive message', (newMessage: Message) => {
//     this.handleNewMessage(newMessage);
//   });
//   // استمع لتحديثات المحادثات
//   this.socket.on("refresh chats", (updatedChats: Chat[]) => {
//     // تحديث قائمة المحادثات في واجهة المستخدم
//     console.log("Chats updated on the client:", updatedChats);
//     // this.chats = updatedChats; // تأكد أن لديك this.chats في الخدمة
//     this.chatsSubject.next(updatedChats);
//   });
//   this.socket.on('disconnect', () => {
//     console.log('Socket disconnected');
//   });

//   this.socket.on('connect_error', (error: any) => {
//     console.error('Connection Error:', error);
//   });
 
// }
//send
sendSocketMessage(messageData: Message) {
  console.log("socket msg ",messageData)
  if (messageData.chat && messageData.chat._id) {
    this.socket.emit('new message', messageData); // إرسال الرسالة
    
  } else {
    console.error('Chat ID is missing, cannot send message.');
  }}
//receive
getSocketMessages(): Observable<Message> {
  return new Observable((observer) => {
    this.socket.on('receive message', (messageData: Message) => {
      console.log("msg received from server",messageData)
      observer.next(messageData);
    });
    return () => {
      this.socket.off('receive message');
    };
  });
}
/*
 loadMessagesForChat(chatId: string) {
    // استدعاء API أو استرجاع الرسائل من قاعدة البيانات
    this.socket.emit('get messages', chatId, (messages: Message[]) => {
      this.messagesSubject.next(messages);
    });
  }
*/
handleNewMessage(newMessage: Message) {
  const currentMessages = this.messagesSubject.getValue(); // الحصول على الرسائل الحالية
  const updatedMessages = [...currentMessages, newMessage]; // إضافة الرسالة الجديدة
  this.messagesSubject.next(updatedMessages); // تحديث BehaviorSubject
}
refreshChats(): Observable<any[]> {
  return new Observable((observer) => {
    this.socket.on('refresh chats', (updatedChats: any[]) => {
      console.log("Chats updated on the server:", updatedChats);
        // تحديث BehaviorSubject بالمحادثات الجديدة
        this.chatsSubject.next(updatedChats);

      observer.next(updatedChats);
    });

    return () => {
      this.socket.off('refresh chats');
    };
  });
}
joinChat(chatId: string) {
  console.log("Attempting to join room:", chatId);
  if (this.socket.connected) {
  this.socket.emit('join chat', chatId, (response: any) => {
    if (response && response.success) {
      console.log("Successfully joined room:", chatId);
    } else {
      console.log("Failed to join room:", chatId, response);
    }
  });}
  else {
    console.log("Socket is not connected, cannot join room:", chatId);
  }
}
// إرسال الحدث setup إلى الخادم مع بيانات المستخدم

  // إرسال حدث setup مع بيانات المستخدم
  setupUser(userData: any) {
    this.socket.emit('setup', userData);
  }

  // الاستماع لحدث 'connected'
  listenForConnected(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('connected', () => {
        console.log('User connected');
        observer.next(true);
      });
    });
  }

  // الاستماع لحدث 'onlineUsers'
  listenForOnlineUsers(): Observable<any[]> {
    return new Observable((observer) => {
      this.socket.on('onlineUsers', (users: any[]) => {
        console.log('Online users:', users);
        observer.next(users);
      });
    });
  }
  
  // إيقاف الاستماع للأحداث
  disconnectListeners() {
    this.socket.off('connected');
    this.socket.off('onlineUsers');
  }
// الاستماع للأحداث الأخرى
listenToSetup(): Observable<any> {
  return new Observable((observer) => {
    this.socket.on('setup', (response: any) => {
      console.log('Setup event received:', response);
      observer.next(response);
    });
  });
}

// إلغاء الاستماع للحدث
disconnectFromSetup() {
  this.socket.off('setup');
}

  getChat(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
  updateChats(updatedChat: Chat, newMessage: Message) {
    const currentChats = this.chatsSubject.getValue();  // الحصول على المحادثات الحالية
    const chatIndex = currentChats.findIndex(chat => chat._id === updatedChat._id);  // إيجاد المحادثة المستهدفة

    if (chatIndex !== -1) {
      // تحديث المحادثة بإضافة الرسالة الجديدة
      const updatedChats = [...currentChats];
      updatedChats[chatIndex] = {
        ...updatedChat,
        latestMessage: newMessage,  // إضافة الرسالة الجديدة كأحدث رسالة
      };
      
      this.chatsSubject.next(updatedChats);  // تحديث الـ BehaviorSubject بالمحادثات الجديدة
    }
  }

  getSelectedChat(_id: string): Observable<[Message]> {
    return this.http.get<[Message]>(`${this.messageUrl}/${_id}`);
  }
  sendMessage(messageData2: { content: string; chatId: string }): Observable<any> {
    const headers = { 'Content-Type': 'application/json' }; // Explicitly set the Content-Type
  return this.http.post(`${this.messageUrl}`, messageData2, { headers });
  }
  sendPhoto(messageData: FormData): Observable<any> {
  return this.http.post(`${this.messageUrl}/photo`, messageData, );
  }
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
  

    if (token) {
      // JWT format is: header.payload.signature
      const tokenParts = token.split('.');
  
      if (tokenParts.length === 3) {
        // Decode the payload part (second part of the token)
        const base64Url = tokenParts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((char) => {
          return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
  
        // Parse the JSON payload to retrieve the userId
        const payload = JSON.parse(jsonPayload);
       
        // Return the userId from the payload (assumed to be stored under 'userId' or 'sub')
        return payload.id || payload.sub;
      }
    }
  
    return null;
  }
  

  setUserId() {
    const userId : string = this.getUserIdFromToken() ||"";
  
  localStorage.setItem('userId', userId);
  }
  

  
}
