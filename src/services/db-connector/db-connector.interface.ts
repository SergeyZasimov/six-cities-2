export interface DbConnectorInterface {
  connect( uri: string ): Promise<void>;

  disconnect(): Promise<void>;
}
