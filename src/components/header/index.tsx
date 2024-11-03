import { Button, Input, Popover, Modal } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import { useContract } from "../../providers/contractProvider";
import style from "./index.module.scss";
import { RightOutlined, UserSwitchOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNotification } from "../../hooks/useNotification";

const Header = () => {
  const {
    chainId,
    account,
    disconnect,
    isAdmin,
    contract,
    name,
    makeAdmin,
    undoAdmin,
    isOnwer,
    balance,
    coinName,
    coinSymbol,
  } = useContract();
  const { openErrorNotification } = useNotification();
  const [counter, setCounter] = useState<any>({});
  const [ADMIN_COST, setAdminCost] = useState<any>(0);
  const [CHANGE_NAME_COST, setChangeNameCost] = useState<any>(0);

  const [loading, setLoading] = useState(false);
  const setCount = useCallback(v => {
    setCounter({ name: v.target.value });
  }, []);

  const changeName = useCallback(async () => {
    if (balance < CHANGE_NAME_COST) {
      openErrorNotification(`No tienes suficiente ${coinName} (${coinSymbol} ${CHANGE_NAME_COST} requeridos)`);
      return;
    }
    setLoading(true);
    await contract.setUserName(counter.name);
    setLoading(false);
  }, [balance, counter, contract, CHANGE_NAME_COST, coinSymbol, coinName]);

  useEffect(() => {
    if (!contract) return;
    contract.SET_ADMIN_COST().then((v: any) => setAdminCost(v));
    contract.CHANGE_NAME_COST().then((v: any) => setChangeNameCost(v));
  }, [contract, account]);

  const innerMakeAdmin = useCallback(async () => {
    Modal.warning({
      title: isAdmin ? "Dejar de ser Administrador" : `Ser Administrador (${coinName} ${coinSymbol} ${ADMIN_COST})`,
      content: isAdmin
        ? "Una vez deje de ser administrador no se podrá deshacer"
        : "Una vez que se haya hecho administrador no podrá contestar preguntas",
      onOk() {
        if (balance < ADMIN_COST) {
          openErrorNotification(`No tienes suficiente ${coinName} ${coinSymbol} ${ADMIN_COST} requeridos)`);
          return;
        }
        isAdmin ? undoAdmin() : makeAdmin();
      },
      okCancel: true,
    });
  }, [contract, isAdmin, balance, ADMIN_COST, coinSymbol, coinName]);

  return (
    <div className={style.header}>
      <div className={style.header_information}>
        <p>{`Red: ${chainId || "--"}`}</p>
        {!isOnwer && <p>{`Balance ${coinName || ""}: ${coinSymbol || ""} ${balance || "0"}`}</p>}
      </div>
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
        <p className={style.account}>{`Cuenta: ${
          isAdmin && isOnwer ? name || "Owner" : isAdmin && !isOnwer ? name || "Admin" : name || account || "---"
        }`}</p>
      </Popover>

      <div className={style.buttons}>
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
