import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgHelpIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps, ref: Ref<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width={800} height={800} fill="none" viewBox="0 0 24 24" ref={ref} aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path stroke="#6a7282" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17h.01M12 14c.89-1.906 3-1.766 3-4 0-1.5-1-3-3-3-1.548 0-2.497.898-2.847 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18" /></svg>;
const ForwardRef = forwardRef(SvgHelpIcon);
const Memo = memo(ForwardRef);
export default Memo;