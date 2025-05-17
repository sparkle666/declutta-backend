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
    return response.json(Object.values(conversations))
  }

  // Get all messages between the authenticated user and another user
  public async index({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const otherUserId = Number(request.input('userId'))
    if (!otherUserId) {
      return response.badRequest({ message: 'userId is required' })
    }
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
    return response.json(messages)
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
}
