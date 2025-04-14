import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef, memo } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLogoIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps, ref: Ref<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" ref={ref} aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<defs><linearGradient id="a" x1="0%" x2="100%" y1="0%" y2="0%"><stop offset="0%" stopColor="#3F72AF" /><stop offset="100%" stopColor="#112D4E" /></linearGradient></defs><text x={20} y={60} fill="url(#a)" fontFamily="Arial, sans-serif" fontSize={60} fontStyle="italic" fontWeight="bold" letterSpacing={1}>{"\n    Poromy\n  "}</text><path stroke="url(#a)" strokeLinecap="round" strokeWidth={3} d="M22 65h213" opacity={0.7} /></svg>;
const ForwardRef = forwardRef(SvgLogoIcon);
const Memo = memo(ForwardRef);
export default Memo;