import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ThreadResponseDto, MessageResponseDto } from './dto/thread-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Messaging')
@Controller('messaging')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('threads')
  @ApiOperation({ summary: 'Create or get existing thread for a listing' })
  @ApiResponse({ status: 201, description: 'Thread created or retrieved successfully', type: ThreadResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 400, description: 'Cannot message about inactive listings or yourself' })
  async createThread(
    @Body() createThreadDto: CreateThreadDto,
    @Request() req: any,
  ): Promise<ThreadResponseDto> {
    return this.messagingService.createThread(createThreadDto, req.user.id);
  }

  @Get('threads')
  @ApiOperation({ summary: 'Get all threads for current user' })
  @ApiResponse({ status: 200, description: 'Threads retrieved successfully', type: [ThreadResponseDto] })
  async getThreads(@Request() req: any): Promise<ThreadResponseDto[]> {
    return this.messagingService.getThreads(req.user.id);
  }

  @Get('threads/:id')
  @ApiOperation({ summary: 'Get specific thread with all messages' })
  @ApiResponse({ status: 200, description: 'Thread retrieved successfully', type: ThreadResponseDto })
  @ApiResponse({ status: 404, description: 'Thread not found or access denied' })
  @ApiParam({ name: 'id', description: 'Thread ID' })
  async getThread(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<ThreadResponseDto> {
    return this.messagingService.getThread(id, req.user.id);
  }

  @Post('threads/:id/messages')
  @ApiOperation({ summary: 'Send message in thread' })
  @ApiResponse({ status: 201, description: 'Message sent successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Thread not found or access denied' })
  @ApiParam({ name: 'id', description: 'Thread ID' })
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() sendMessageDto: SendMessageDto,
    @Request() req: any,
  ): Promise<MessageResponseDto> {
    return this.messagingService.sendMessage(id, sendMessageDto, req.user.id);
  }

  @Post('threads/:id/mark-read')
  @ApiOperation({ summary: 'Mark thread as read' })
  @ApiResponse({ status: 200, description: 'Thread marked as read successfully' })
  @ApiResponse({ status: 404, description: 'Thread not found or access denied' })
  @ApiParam({ name: 'id', description: 'Thread ID' })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.messagingService.markAsRead(id, req.user.id);
    return { message: 'Thread marked as read' };
  }

  @Get('threads/:id/messages')
  @ApiOperation({ summary: 'Get messages in thread with pagination' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: [MessageResponseDto] })
  @ApiResponse({ status: 404, description: 'Thread not found or access denied' })
  @ApiParam({ name: 'id', description: 'Thread ID' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Messages per page', required: false, example: 50 })
  async getMessages(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 50,
    @Request() req: any,
  ): Promise<MessageResponseDto[]> {
    return this.messagingService.getMessages(id, req.user.id, page, limit);
  }
}
