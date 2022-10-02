export const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DbConnectorInterface: Symbol.for('DbConnectorInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  OfferModel: Symbol.for('OfferModel'),
  CommentModel: Symbol.for('CommentModel'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
} as const;
