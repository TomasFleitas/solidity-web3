import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Answer } from "../../Model/Answer";
import { useContract } from "../../providers/contractProvider";
import style from "./index.module.scss";

const AnswersDetail = () => {
  const { user } = useParams();
  const { contract, account, isAdmin } = useContract();
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    (async () => {
      if (contract) {
        if (!user) {
          const resp = await contract.getAnswerByAccount(account);
          formatAnswers(resp);
        } else if (isAdmin) {
          const resp = await contract.getAnswerByAccount(user);
          formatAnswers(resp);
        }
      }
    })();
  }, [contract]);

  const formatAnswers = async (resp: any[]) => {
    const aux = [];
    for (let index = 0; index < resp.length; index++) {
      const an = new Answer(resp[index]);
      const qst = await contract.getQuestionById(an.question_id);
      an.setQuestionText = qst[0];
      an.setOptions = qst[1];
      aux.push(an);
    }
    setAnswers(aux);
  };

  console.log(answers);

  return <div>AnswersDetail</div>;
};

export default AnswersDetail;
