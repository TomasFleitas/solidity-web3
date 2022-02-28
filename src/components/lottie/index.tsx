import { memo } from "react";
import Lottie from "react-lottie";
import finish from "./finish.json";

const LottieF = () => {
  return (
    <Lottie
      options={{
        loop: false,
        autoplay: true,
        animationData: finish,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      }}
      height={300}
      width={300}
    />
  );
};

export default memo(LottieF);
