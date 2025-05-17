import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgCheckIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps, ref: Ref<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width={800} height={800} fill="none" viewBox="0 0 20 20" ref={ref} aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 5 8 15l-5-4" /></svg>;
const ForwardRef = forwardRef(SvgCheckIcon);
const Memo = memo(ForwardRef);
export default Memo;