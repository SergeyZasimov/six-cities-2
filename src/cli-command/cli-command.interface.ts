export interface CliCommandInterface {
  readonly name: string;

  execute( ...parameters: (string | number)[] ): void;
}
