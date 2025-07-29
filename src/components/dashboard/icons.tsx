import type { SVGProps } from 'react';

export function JiraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.212 2.39a1 1 0 0 0-1.415 0l-8.485 8.485a1 1 0 0 0 0 1.414l5.683 5.683a1 1 0 0 0 1.414 0l8.485-8.485a1 1 0 0 0 0-1.414l-5.682-5.683Z" />
      <path d="m15.823 12.019-5.605 5.605" />
      <path d="m12.05 15.794-5.637-5.637" />
    </svg>
  );
}
