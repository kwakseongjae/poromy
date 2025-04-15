import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgHamburgerIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps, ref: Ref<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 16 16" ref={ref} aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round" d="M2.5 4h11m-11 4h11m-11 4h11" /></svg>;
const ForwardRef = forwardRef(SvgHamburgerIcon);
const Memo = memo(ForwardRef);
export default Memo;