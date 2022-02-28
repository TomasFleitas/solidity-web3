import { Image, Switch } from "antd";
import { memo, useEffect, useState } from "react";
import { Question } from "../../Model/Question";
import { useContract } from "../../providers/contractProvider";
import style from "./index.module.scss";

const AllQuestinos = () => {
  const { contract, event, isOnwer } = useContract();
  const [questions, setQuestion] = useState<Question[]>([]);
  const [loading, setLoading] = useState<any>({});

  useEffect(() => {
    getAllQuestion();
  }, [contract, event]);

  const getAllQuestion = async () => {
    setQuestion((await contract.getAllQuestion()).map((e: any) => new Question(e)));
  };

  const onChange = async (id: number, v: boolean) => {
    setLoading({ ...loading, [id]: true });
    await contract.setVsibileQuestion(id, v);
    getAllQuestion();
    setLoading({ ...loading, [id]: false });
  };

  return (
    <div className={style.all_question}>
      {questions.map((item, index) => (
        <div className={style.question} key={index}>
          <div className={style.question_img}>
            <Image src={item.image} />
          </div>
          <div className={style.question_info}>
            <h3 className={style.question_text}>{item.text}</h3>
            <div className={style.question_options}>
              {item.options?.map(opt => (
                <div key={`opt-${opt.id}`}>{`${opt.id} - ${opt.text}`}</div>
              ))}
            </div>
            <div className={style.correct_answer}>{`Respuesta correcta: ${
              item.options.find(opt => opt.id === item.correctAns)?.text
            }`}</div>
            <div className={style.question_time}>{`Tiempo para responder: ${item.lifetimeSeconds}`}</div>
          </div>
          {isOnwer && <Switch
            loading={loading[item.id]}
            defaultChecked={item.visible}
            onChange={v => {
              onChange(item.id, v);
            }}
          />}
        </div>
      ))}
    </div>
  );
};

export default memo(AllQuestinos);
