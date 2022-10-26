import UserDto from '../user/user.dto.js';

export default class CommentDto {
  public id!: string;

  public text!: string;

  public rating!: number;

  public postDate!: string;

  public user!: UserDto;
}
