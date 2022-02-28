import { Button } from "antd";
import { Navigate } from "react-router-dom";
import { useContract } from "../../providers/contractProvider";
import style from "./index.module.scss";

const Login = () => {
  const { connectWallet, active } = useContract();
  return (
    <>
     
        <div className={style.login}>
          <div className={style.card_login}>
            <h1>Conectate a tu Billetera</h1>
            <Button onClick={connectWallet} type="primary">
              Conectar a la wallet
            </Button>
          </div>
        </div>

    </>
  );
};

export default Login;
