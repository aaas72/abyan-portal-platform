import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  async trackVisit(
    section: string,
    ip: string,
    entityId?: string,
    entityName?: string,
  ): Promise<void> {
    try {
      // Hash the IP to maintain privacy
      const ipHash = crypto
        .createHash('sha256')
        .update(ip || 'unknown')
        .digest('hex');

      // Check if this IP visited this section/entity within the last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const recentVisit = await this.visitModel.findOne({
        section,
        ...(entityId && { entityId }),
        ipHash,
        createdAt: { $gte: twentyFourHoursAgo },
      });

      // If no recent visit from this IP, log it
      if (!recentVisit) {
        await this.visitModel.create({
          section,
          ipHash,
          ...(entityId && { entityId }),
          ...(entityName && { entityName }),
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to track visit for section ${section}: ${errorMessage}`,
      );
    }
  }

  async getStats(): Promise<any[]> {
    try {
      return await this.visitModel.aggregate([
        {
          $group: {
            _id: '$section',
            totalVisits: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$ipHash' },
          },
        },
        {
          $project: {
            section: '$_id',
            totalVisits: 1,
            uniqueVisitorsCount: { $size: '$uniqueVisitors' },
            _id: 0,
          },
        },
        {
          $sort: { uniqueVisitorsCount: -1 },
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to aggregate stats: ${errorMessage}`);
      throw error;
    }
  }

  async getTopEntities(limit: number = 5): Promise<any[]> {
    try {
      return await this.visitModel.aggregate([
        {
          $match: {
            entityId: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: '$entityId',
            section: { $first: '$section' },
            entityName: { $first: '$entityName' },
            totalVisits: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$ipHash' },
          },
        },
        {
          $project: {
            entityId: '$_id',
            section: 1,
            entityName: 1,
            totalVisits: 1,
            uniqueVisitorsCount: { $size: '$uniqueVisitors' },
            _id: 0,
          },
        },
        {
          $sort: { uniqueVisitorsCount: -1 },
        },
        {
          $limit: limit,
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to aggregate top entities: ${errorMessage}`);
      throw error;
    }
  }
}
