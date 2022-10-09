import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import multer, { diskStorage } from 'multer';
import mime from 'mime';
import { nanoid } from 'nanoid';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private entityName: string,
  ) {
  }

  public async execute( req: Request, res: Response, next: NextFunction ): Promise<void> {
    const storage = diskStorage({
      destination: ( _req, _file, callback ) => {
        callback(null, `${this.uploadDirectory}/${this.entityName}`);
      },
      filename: ( _req, file, callback ) => {
        const extension = mime.getExtension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      },
    });

    const uploadSingleFileMiddleware = multer({ storage }).single(this.fieldName);
    uploadSingleFileMiddleware(req, res, next);
  }
}
