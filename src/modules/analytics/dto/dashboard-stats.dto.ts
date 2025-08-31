import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ example: 24 })
  totalListings: number;

  @ApiProperty({ example: 1247 })
  totalViews: number;

  @ApiProperty({ example: 18 })
  unreadMessages: number;

  @ApiProperty({ example: 3450 })
  totalSales: number;

  @ApiProperty({ example: '+3 this month' })
  listingsChange: string;

  @ApiProperty({ example: '+12% this week' })
  viewsChange: string;

  @ApiProperty({ example: '5 unread' })
  messagesChange: string;

  @ApiProperty({ example: '+$450 this month' })
  salesChange: string;
}

export class TopListingDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'iPhone 14 Pro Max - 256GB' })
  title: string;

  @ApiProperty({ example: 234 })
  views: number;

  @ApiProperty({ example: 12 })
  messages: number;

  @ApiProperty({ example: 899 })
  price: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  image: string;
}

export class RecentActivityDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'listing_viewed' })
  type: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max viewed' })
  title: string;

  @ApiProperty({ example: 'Your listing received 5 new views' })
  description: string;

  @ApiProperty({ example: '2 hours ago' })
  time: string;
}

export class DashboardOverviewDto {
  @ApiProperty({ type: DashboardStatsDto })
  stats: DashboardStatsDto;

  @ApiProperty({ type: [TopListingDto] })
  topListings: TopListingDto[];

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivity: RecentActivityDto[];

  @ApiProperty({ example: 'John Doe' })
  userName: string;
}
