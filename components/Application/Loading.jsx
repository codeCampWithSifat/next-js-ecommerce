import Image from "next/image";
import loading from "../../public/assets/images/loading.svg";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center mt-12">
      <Image src={loading.src} height={80} width={80} alt="loading" />
    </div>
  );
};

export default Loading;
