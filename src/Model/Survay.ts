import { Question } from "./Question";

export class Survay {
  public title!: string;
  public image!: string;
  private question!: Question[];

  constructor(obj?: any) {
    if (!obj) return;
    const { title, image } = obj;
    Object.assign(this, { title, image });
  }

  set setQuestion(qst: any[]) {
    this.question = qst;
  }

  get getQuestion() {
    return this.question;
  }
}