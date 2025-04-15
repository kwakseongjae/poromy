import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgBulbIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps, ref: Ref<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 16 16" ref={ref} aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="#1E1E1E" d="M9.875 13.875h-3.75A.125.125 0 0 0 6 14v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V14a.125.125 0 0 0-.125-.125M8 1a5.126 5.126 0 0 0-2.562 9.564v1.811a.5.5 0 0 0 .5.5h4.125a.5.5 0 0 0 .5-.5v-1.81A5.126 5.126 0 0 0 8 1m1.998 8.59-.56.326v1.834H6.562V9.916l-.56-.325a4 4 0 1 1 3.997 0" /></svg>;
const ForwardRef = forwardRef(SvgBulbIcon);
const Memo = memo(ForwardRef);
export default Memo;