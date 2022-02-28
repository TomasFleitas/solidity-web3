import style from "./index.module.scss";
import Header from "../../components/header";
import { memo, useState } from "react";
import { useContract } from "../../providers/contractProvider";
import AllQuestinos from "../../components/allQuestinos";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddQuestion from "../../components/addQuestion";
import AnswerQuestion from "../../components/answerQuestion/answerQuestion";
import Clasifications from "../../components/clasifications";
import AllAdmins from "../../components/allAdmins";
const { TabPane } = Tabs;

const Home = () => {
  const { isAdmin } = useContract();
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const operations = (
    <Button onClick={() => setShowAddQuestion(true)}>
      <PlusOutlined />
    </Button>
  );

  return (
    <>
      <div className={style.home}>
        <Header />
        <div className={style.main_content}>
          {(isAdmin && (
            <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
              <TabPane tab="Preguntas" key="1">
                <AllQuestinos />
              </TabPane>
              <TabPane tab="Clasificaciones" key="2">
                <Clasifications />
              </TabPane>
              <TabPane tab="Administradores" key="3">
                <AllAdmins />
              </TabPane>
            </Tabs>
          )) || <AnswerQuestion />}
          {isAdmin && <AddQuestion show={showAddQuestion} onClose={() => setShowAddQuestion(false)} />}
        </div>
      </div>
    </>
  );
};

export default memo(Home);
