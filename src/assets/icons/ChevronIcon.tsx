import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgChevronIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps, ref: Ref<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 12 12" ref={ref} aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path d="M2.15 7.85a.5.5 0 0 0 .707 0l3.15-3.15 3.15 3.15a.5.5 0 0 0 .707-.707l-3.5-3.5a.5.5 0 0 0-.707 0l-3.5 3.5a.5.5 0 0 0 0 .707z" clipRule="evenodd" /></svg>;
const ForwardRef = forwardRef(SvgChevronIcon);
const Memo = memo(ForwardRef);
export default Memo;