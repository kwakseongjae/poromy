import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgEditIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps, ref: Ref<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 20 20" ref={ref} aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="#1E1E1E" stroke="currentColor" d="M18.697 3.775a1.5 1.5 0 0 1 0 2.122l-11.78 11.78-5.53.933.934-5.53L14.101 1.3a1.5 1.5 0 0 1 2.121 0zm-5.532-.125-.353.354.353.353 2.475 2.475.354.354.353-.354L17.99 5.19l.354-.353-.354-.354-2.475-2.474-.353-.353-.354.353zm1.767 4.597.354-.353-.354-.354-2.473-2.475-.354-.353-.354.353-8.384 8.384-.113.113-.026.158-.503 2.977-.117.693.693-.117 2.977-.502.157-.027.113-.113z" /></svg>;
const ForwardRef = forwardRef(SvgEditIcon);
const Memo = memo(ForwardRef);
export default Memo;