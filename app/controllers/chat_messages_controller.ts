
import type { HttpContext } from '@adonisjs/core/http'
import ChatMessage from '#models/chat_message'
import User from '#models/user'
import { chatMessageValidator } from '#validators/ChatMessageValidator'


export default class ChatMessagesController {
  // List all conversations for the authenticated user (latest message per user)
  public async conversations({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    // Get the latest message per conversation (sender/receiver pair)
    const messages = await ChatMessage.query()
      .where((query) => {
        query.where('sender_id', userId).orWhere('receiver_id', userId)
      })
      .orderBy('created_at', 'desc')
    // Group by conversation partner
    const conversations: Record<number, ChatMessage> = {}
    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId
      if (!conversations[partnerId]) {
        conversations[partnerId] = msg
      }
    }
    const partnerIds = Object.keys(conversations).map(Number)
    // Fetch all partner user details in one query
    let usersById: Record<number, any> = {}
    if (partnerIds.length > 0) {
      const users = await User.query()
        .whereIn('id', partnerIds)
        .select('id', 'fullName', 'firstName', 'lastName', 'profilePicture', 'email', 'bio', 'gender', 'dateOfBirth', 'phoneNumber', 'isEmailVerified', 'createdAt')
      usersById = users.reduce((acc, user) => {
        acc[user.id] = user
        return acc
      }, {} as Record<number, any>)
    }
    // Return array of conversations with partner user details
    const result = Object.entries(conversations).map(([partnerId, msg]) => ({
      partnerId: Number(partnerId),
      message: msg,
      user: usersById[Number(partnerId)] || null
    }))
    return response.json(result)
  }

  // Get all messages between the authenticated user and another user
  public async index({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const otherUserId = Number(request.input('userId'))
    if (!otherUserId) {
      return response.badRequest({ message: 'userId is required' })
    }
    // Fetch messages between the two users
    const messages = await ChatMessage.query()
      .where((query) => {
        query
          .where('sender_id', userId)
          .where('receiver_id', otherUserId)
      })
      .orWhere((query) => {
        query
          .where('sender_id', otherUserId)
          .where('receiver_id', userId)
      })
      .orderBy('created_at', 'asc')

    // Fetch the other user's profile (select only important fields)
    const otherUser = await User.query()
      .select('id', 'fullName', 'firstName', 'lastName', 'profilePicture', 'email', 'bio', 'gender', 'dateOfBirth', 'phoneNumber', 'isEmailVerified', 'createdAt')
      .where('id', otherUserId)
      .first()

    if (!otherUser) {
      return response.notFound({ message: 'Other user not found' })
    }

    return response.json({
      messages,
      otherUser
    })
  }

  // Send a new message
  public async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const { receiverId, message } = await request.validateUsing(chatMessageValidator)
    if (receiverId === userId) {
      return response.badRequest({ message: 'Cannot send message to yourself' })
    }
    // Optionally check if receiver exists
    const receiver = await User.find(receiverId)
    if (!receiver) {
      return response.notFound({ message: 'Receiver not found' })
    }
    const chatMessage = await ChatMessage.create({
      senderId: userId,
      receiverId,
      message,
      isRead: false,
    })
    return response.created(chatMessage)
  }

  // Mark all messages from a user as read
  public async markAsRead({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const otherUserId = Number(request.input('userId'))
    if (!otherUserId) {
      return response.badRequest({ message: 'userId is required' })
    }
    await ChatMessage.query()
      .where('sender_id', otherUserId)
      .where('receiver_id', userId)
      .update({ isRead: true })
    return response.ok({ message: 'Messages marked as read' })
  }
  // Mark a single message as read
  public async markMessageAsRead({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const messageId = Number(params.id)
    if (!messageId) {
      return response.badRequest({ message: 'Message ID is required' })
    }
    const message = await ChatMessage.find(messageId)
    if (!message) {
      return response.notFound({ message: 'Message not found' })
    }
    // Only the receiver can mark as read
    if (message.receiverId !== userId) {
      return response.forbidden({ message: 'You are not allowed to mark this message as read' })
    }
    message.isRead = true
    await message.save()
    return response.ok({ message: 'Message marked as read', chatMessage: message })
  }

  
}
