import Image from "next/image";
import loading from "@/assets/loading.svg";

const ASpinner = ({
  className,
  size = 100,
}: {
  className?: string;
  size?: number;
}) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <Image src={loading} alt="loader" width={size} height={size} />
    </div>
  );
};

export default ASpinner;
