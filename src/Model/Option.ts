export class Option {
  public id!: string;
  public text!: string;

  constructor(obj?: string) {
    if (!obj) return;
    Object.assign(this, { id: obj.split("_")[0], text: obj.split("_")[1] });
  }
}