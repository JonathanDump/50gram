## 50gram

Welcome to the Full Stack Messenger App! This is a real-time messaging application built using React, Node.js, and other modern technologies.

# [Live Demo](https://frabjous-cucurucho-ceeec1.netlify.app/)

# Technologies Used

Here is a list of technologies and libraries used to build this messenger application:

- **Frontend**:
  - React
  - TypeScript
  - HTML/SCSS
  - Socket.io for real-time communication
  - React Router
  
- **Backend**:
  - Node.js
  - Express.js
  - TypeScript
  - Socket.io 
  - MongoDB 
  - JSON Web Tokens (JWT) for authentication
  - Otp for 2FA

- **Deployment**:
  - Netlify (client)
  - Render (server)
  - MongoDB

# Functionalities
1. **User Registration and Authentication**:
   - Users can create accounts and log in securely.
   - Google OAuth 2.0 sign in.
   - JWT tokens are used for authentication.
   - Otp used for 2FA

2. **Real-Time Messaging**:
   - Users can send and receive real-time text and image messages.
   - Messages are delivered instantly using WebSockets.

3. **Message History**:
   - Users can view their message history within each chat.
   - Message history is persisted and can be accessed across sessions.

4. **User Profiles**:
   - Users can view and update their profiles.
   - Profile pictures can be added and modified.
   - User name can be added and modified.

5. **Online Status**:
   - Real time online status update of contacts.
   - A green dot indicates when a contact is online.

6. **Notifications**:
   - Users receive notifications for new messages.
   - Unread messages are visually highlighted.
   - Real time message status update.

7. **Emoji Support**:
   - Users can use emojis in their messages for a more expressive conversation.

8. **Security**:
    - Otp is used as 2FA.
    - Authentication tokens are validated for each request.
    - User can singn is with google account.

9. **Responsive Design**:
    - The application is responsive and works seamlessly on both desktop and mobile devices.

