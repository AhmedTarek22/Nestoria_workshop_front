// export interface  IChat {
//     _id: string; 
//     chatName: string;
//      users: User
// }
export interface User {
    registrationDocuments: {
      cloudinary_id: string;
      photo: string;
    };
    _id: string;
    fullName: string;
    email: string;
    address: string;
    photo: string;
    phone: string;
    isLoggedin: boolean;
    myCart: any[];
    role: string;
    isConfirm: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    acceptance: boolean;
    name?: string; // name is optional as it appears in only one user object
    registerStatus: string;
    balance: number;
    ordersSold: number;
    products: any[];
    ratings: any[];
    token: string;
    topSellingProducts: any[];
    cloudinary_id: string;
    id: string;
  }
  
  // Interface for the sender within a message
 export interface Sender {
    _id: string;
    fullName: string;
    email: string;
    id: string;
  }
  
  // Interface for the latest message
  export interface Message {
    _id: string;
    sender: Sender;
    photo: string;
    content: string;
    chat: Chat;
    readBy: any[];
    cloudinary_id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  }
  
  // Interface for the chat object
  export interface Chat {
    _id: string;
    chatName: string;
    users: User[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    latestMessage: Message;
    
    id: string;
  }
/**

*/   