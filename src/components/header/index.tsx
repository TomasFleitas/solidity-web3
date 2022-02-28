import { Button, Input, Popover, Modal } from "antd";
import { memo, useCallback, useState } from "react";
import { useContract } from "../../providers/contractProvider";
import style from "./index.module.scss";
import { RightOutlined, UserSwitchOutlined, LogoutOutlined } from "@ant-design/icons";

const Header = () => {
  const { chainId, account, disconnect, isAdmin, contract, name, makeAdmin, undoAdmin, isOnwer } = useContract();
  const [counter, setCounter] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const setCount = useCallback(v => {
    setCounter({ name: v.target.value });
  }, []);

  const changeName = useCallback(async () => {
    setLoading(true);
    await contract.setUserName(counter.name);
    setLoading(false);
  }, [counter, contract]);

  const innerMakeAdmin = useCallback(async () => {
    Modal.warning({
      title: isAdmin ? "Dejar de ser Administrador" : "Ser Administrador",
      content: isAdmin
        ? "Una vez deje de ser administrador no se podrá deshacer"
        : "Una vez que se haya hecho administrador no podrá contestar preguntas",
      onOk() {
        isAdmin ? undoAdmin() : makeAdmin();
      },
      okCancel: true,
    });
  }, [contract, isAdmin]);

  return (
    <div className={style.header}>
      <div>{`Red: ${chainId || "--"}`}</div>
      <Popover
        placement="bottom"
        title="Cambiar nombre"
        content={
          <Input.Group compact>
            <Input
              maxLength={25}
              suffix={<p style={{ margin: 0 }}>{`${counter["name"]?.length || 0}/25`}</p>}
              onChange={setCount}
              style={{ width: "calc(100% - 50px)" }}
            />
            <Button loading={loading} onClick={changeName} style={{ width: "50px" }} type="primary">
              <RightOutlined />
            </Button>
          </Input.Group>
        }
        trigger="click">
        <p className={style.account}>{`Cuenta: ${isAdmin ? name || "Soy Admin" : name || account || "---"}`}</p>
      </Popover>

      <div>
        {!isOnwer && (
          <button onClick={innerMakeAdmin}>
            <UserSwitchOutlined />
          </button>
        )}
        <button onClick={disconnect}>
          <LogoutOutlined />
        </button>
      </div>
    </div>
  );
};

export default memo(Header);
