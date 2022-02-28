import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useContract } from "../../providers/contractProvider";
import { Name } from "../clasifications";
import style from "./index.module.scss";
import { CloseOutlined } from "@ant-design/icons";

const AllAdmins = () => {
  const { contract, account, event } = useContract();
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState<any>({});

  useEffect(() => {
    (async () => {
      setList(await contract.getAdmins());
    })();
  }, [contract, event]);

  const removeAdmin = async (admin: string) => {
    setLoading({ ...loading, [admin]: true });
    await contract.deleteAdmin(admin);
    setLoading({ ...loading, [admin]: false });
  };

  return (
    <div className={style.all_admins}>
      {list.map((item, index) => (
        <Row key={index}>
          <Col span={account != item ? 20 : 24}>
            <Name account={item} />
          </Col>
          {account != item && (
            <Col span={4}>
              <Button loading={loading[item]} onClick={() => removeAdmin(item)}>
                <CloseOutlined />
              </Button>
            </Col>
          )}
        </Row>
      ))}
    </div>
  );
};

export default AllAdmins;
