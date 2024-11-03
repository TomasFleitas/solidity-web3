import { Option } from "./Option";

export class Answer {
  public anwser_id!: string;
  public correctAns!: number;
  public question_id!: string;
  private question!: string;
  private opts!: Option[];


  constructor(obj?: any) {
    if (!obj) return;
    const { anwser_id, correctAns, question_id } = obj;
    Object.assign(this, { question_id: question_id.toNumber(), correctAns, anwser_id });
  }

  set setQuestionText(questionText: string) {
    this.question = questionText;
  }

  get questionText() {
    return this.question;
  }

  set setOptions(opts: string[]) {
    const option: Option[] = opts?.map((option: string) => new Option(option));
    this.opts = option;
  }

  get options(): Option[] {
    return this.opts;
  }
}