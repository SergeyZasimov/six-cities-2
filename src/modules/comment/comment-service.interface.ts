import CreateCommentDTO from './dto/create-comment.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';

export interface CommentServiceInterface {
  create( dto: CreateCommentDTO ): Promise<DocumentType<CommentEntity>>;

  findByOfferId( offerId: string ): Promise<DocumentType<CommentEntity>[]>;
}
