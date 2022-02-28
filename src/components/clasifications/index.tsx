import style from "./index.module.scss";
import { useEffect, useState } from "react";
import { useContract } from "../../providers/contractProvider";
import { Clasification } from "../../Model/Clasification";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

type props = { myClasification: boolean };

const Clasifications = ({ myClasification }: props) => {
  const { contract, account } = useContract();

  const [list, setList] = useState<Clasification[]>([]);

  useEffect(() => {
    (async () => {
      if (!contract) return;
      setList(quickSort((await contract.getClasifications()).map((item: any) => new Clasification(item))));
    })();
  }, [contract]);

  // made a quicksort to sort the list
  const quickSort = (list: Clasification[]): Clasification[] => {
    if (list.length <= 1) return list;
    const pivot = list[0];
    const left = [];
    const right = [];
    for (let i = 1; i < list.length; i++) {
      if (list[i].value < pivot.value) {
        left.push(list[i]);
      } else {
        right.push(list[i]);
      }
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
  };

  const getMyClasification = () => {
    let position = 1;
    let value = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].user == account) {
        position = i + 1;
        value = list[i].value;
        break;
      }
    }
    return { value, position };
  };

  return (
    <div className={style.clasifications}>
      
      {myClasification && (
        <div>{`My posición actual es #${getMyClasification().position} con ${getMyClasification().value} puntos`}</div>
      )}

      <div className={style.clasifications_head}>
        <Row>
          <Col span={2}>#</Col>
          <Col span={10}>Usuario</Col>
          <Col span={10}>Puntaje</Col>
        </Row>
      </div>
      {list.map((item, index) => (
        <div className={style.clasifications_item} key={index}>
          <Row>
            <Col span={2}>#{index + 1}</Col>
            <Col span={10}>
              <Name account={item.user} />
            </Col>
            <Col span={10}>{item.value}</Col>
            <Col span={2}>
              <Link style={{ color: "var(--primary-color)" }} to={`/clasification/${item.user}`}>
                Detalle
              </Link>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default Clasifications;

export const Name = ({ account }: { account: string }) => {
  const { contract } = useContract();
  const [name, setname] = useState<string>(account);

  useEffect(() => {
    (async () => {
      try {
        setname(await contract.getUserNameByAccount(account));
      } catch (error) {}
    })();
  }, []);

  return <>{name || account}</>;
};
