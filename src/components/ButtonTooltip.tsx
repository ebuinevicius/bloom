import { FC, ReactNode, useRef } from 'react';

interface Props {
  children: ReactNode;
  tooltip?: string;
}

const ButtonTooltip: FC<Props> = ({ children, tooltip }): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current || !container.current) return;
        const { left } = container.current.getBoundingClientRect();

        tooltipRef.current.style.left = clientX - left + 'px';
      }}
      className="group relative inline-block"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-slate-600 text-white font-semibold p-1 rounded absolute top-full mt-2 whitespace-nowrap -translate-x-1/2 z-10 px-2"
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
};

export default ButtonTooltip;
