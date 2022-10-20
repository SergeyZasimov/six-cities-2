import { CommentServiceInterface } from './comment-service.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDTO from './dto/create-comment.dto.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import { SortType } from '../../types/sort-type.enum.js';
import { COMMENTS_COUNT } from './comment.constant.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {
  }

  public async create( dto: CreateCommentDTO ): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info('New comment created');
    return result.populate('userId');
  }

  public async findByOfferId( offerId: string ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Down })
      .limit(COMMENTS_COUNT)
      .populate('userId');
  }
}
