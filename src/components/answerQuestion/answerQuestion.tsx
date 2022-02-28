import { Image } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Question } from "../../Model/Question";
import { useContract } from "../../providers/contractProvider";
import CountDown from "../countDown";
import LottieF from "../lottie";
import style from "./index.module.scss";

const AnswerQuestion = () => {
  const { contract } = useContract();
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [questionCount, setQuestionCount] = useState<number>();
  const [answeredCount, setansweredCount] = useState<number>();
  const [finish, setFinish] = useState(false);
  const [stop, setStop] = useState<boolean>(false);

  useEffect(() => {
    if (!contract) return;
    getNextQuestion();
  }, [contract]);

  const getNextQuestion = async (nextId: number = 0) => {
    setQuestionCount((await contract.getQuestionNumber()).toNumber());
    setansweredCount((await contract.getAnsweredCount()).toNumber());
    setCurrentQuestion(undefined);
    try {
      const qst = new Question(await contract.getNextQuestion(nextId));
      if (!qst.text || !!!qst.options.length) {
        setFinish(true);
      } else {
        setCurrentQuestion(qst);
      }
    } catch (error: any) {
      if (error?.data?.message?.match("Id no valido")) {
        setFinish(true);
      }
      console.log(error);
    }
  };

  const anwser = useCallback(
    async (id: string) => {
      try {
        setStop(true);
        currentQuestion && (await contract.answer(id.toString(), currentQuestion.id.toString()));
        setStop(false);
        currentQuestion && getNextQuestion(currentQuestion?.id + 1);
      } catch (error) {
        console.log(error);
      }
    },
    [currentQuestion]
  );

  const onEnd = useCallback(() => {
    currentQuestion && getNextQuestion(currentQuestion?.id + 1);
  }, [currentQuestion]);

  return (
    (currentQuestion && (
      <div className={style.anwser_question}>
        <div className={style.anwser_float_image}>
          <Image fallback="https://loremflickr.com/320/240" src={currentQuestion?.image} />
        </div>
        <div>{`Preguntas contestadas: ${answeredCount}/${questionCount}`}</div>
        <h3>{currentQuestion?.text}</h3>
        <div className={style.anwser_content}>
          <div className={style.anwser_content_options}>
            {currentQuestion?.options.map((answer, index) => (
              <div onClick={() => anwser(answer.id)} key={`opt-${answer.id}`}>
                {answer.text}
              </div>
            ))}
          </div>
        </div>
        <CountDown stop={stop} onEnd={onEnd} lifetimeSeconds={currentQuestion?.lifetimeSeconds} />
      </div>
    )) ||
    (finish && (
      <div className={style.finish_answers}>
        <LottieF />
        <h3>
          Has Terminado todas las preguntas!!! puedes ver la tabla de clasificaciones{" "}
          <Link style={{ color: "var(--primary-color)" }} to={"clasification"}>
            haciendo clieck aqui
          </Link>
        </h3>
      </div>
    )) || <></>
  );
};

export default memo(AnswerQuestion);
