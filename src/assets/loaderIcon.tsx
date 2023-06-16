import { LucideProps } from "lucide-react";

function LoaderIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
      width={props.size}
      height={props.size}
      {...props}
    >
      <path
        fill="#FEF8FD"
        d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0s10 4.477 10 10zM2.99 10a7.01 7.01 0 1014.02 0 7.01 7.01 0 00-14.02 0z"
      ></path>
      <circle
        cx="18.572"
        cy="10"
        r="1.429"
        fill="#202124"
        transform="rotate(-90 18.572 10)"
      ></circle>
      <path
        fill="url(#paint0_angular_931_647)"
        d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 17.14a7.14 7.14 0 100-14.28 7.14 7.14 0 000 14.28z"
      ></path>
      <defs>
        <radialGradient
          id="paint0_angular_931_647"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(10 0 0 10 10 10)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#202124"></stop>
          <stop offset="1" stopColor="#D9D9D9" stopOpacity="0"></stop>
        </radialGradient>
      </defs>
    </svg>
  );
}

export default LoaderIcon;
