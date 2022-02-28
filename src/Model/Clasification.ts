export class Clasification {
  public user!: string;
  public value!: number;

  constructor(obj?: any) {
    if (!obj) return;
    const { user, value } = obj;
    Object.assign(this, { user, value: value.toNumber() });
  }
}