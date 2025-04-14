import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgExclamationIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps, ref: Ref<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 20 20" ref={ref} aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<g clipPath="url(#a)"><path fill="gray" d="M2.93 17.07A10 10 0 1 1 16.826 2.683 10 10 0 0 1 2.93 17.07m12.73-1.41A8.004 8.004 0 1 0 4.34 4.34a8.004 8.004 0 0 0 11.32 11.32M9 5h2v6H9zm0 8h2v2H9z" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z" /></clipPath></defs></svg>;
const ForwardRef = forwardRef(SvgExclamationIcon);
const Memo = memo(ForwardRef);
export default Memo;