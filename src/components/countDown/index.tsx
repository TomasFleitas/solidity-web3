import { Progress } from "antd";
import { memo, useEffect, useState } from "react";
import style from "./index.module.scss";

type props = { lifetimeSeconds: number | undefined; onEnd: Function; stop: boolean };

const CountDown = ({ lifetimeSeconds = 1, onEnd, stop = false }: props) => {
  const [time, setTimer] = useState<number>(lifetimeSeconds);

  useEffect(() => {
    if (!lifetimeSeconds || stop) return;
    const interval = setInterval(() => {
      setTimer(time => time - 1);
    }, 1000);

    if (time === 0) {
      clearInterval(interval);
      onEnd();
      return;
    }
    return () => clearInterval(interval);
  }, [time, lifetimeSeconds]);

  return (
    <div className={style.count_down}>
      <Progress
        percent={(time / lifetimeSeconds) * 100}
        showInfo={false}
        strokeColor={{ to: "var(--primary-color)", from: "var(--primary-color)" }}
      />
      <div className={style.seconds}>{`${time} s`}</div>
    </div>
  );
};

export default memo(CountDown);
