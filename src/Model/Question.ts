import { Option } from "./Option";

export class Question {
  public id!: number;
  public text!: string;
  public image!: string;
  public lifetimeSeconds!: number;
  public options!: Option[];
  public correctAns!: string;
  public visible!: boolean;

  constructor(obj?: any) {
    if (!obj) return;
    const { id, text, lifetimeSeconds, options, image, correctAns, visible } = obj;
    const option: Option[] = options?.map((option: string) => new Option(option));
    Object.assign(this, { id: id.toNumber(), text, lifetimeSeconds: lifetimeSeconds.toNumber(), options: option, image, correctAns,visible });
  }
}