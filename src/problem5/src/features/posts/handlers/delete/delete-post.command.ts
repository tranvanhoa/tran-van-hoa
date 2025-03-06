export class DeletePostCommand {
  constructor(
    public readonly slug: string,
    public readonly userId: number,
  ) {}
}
