import type {AnchorHTMLAttributes} from "react";
/** Native document navigation avoids a production prefetch issue in the Sites runtime. */
export default function SiteLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}
