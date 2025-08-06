import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import Icon from "@ant-design/icons/lib/components/Icon";

const MoveIconSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -1 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M12 22L8 18H16L12 22ZM12 2L16 6H8L12 2ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM2 12L6 8V16L2 12ZM22 12L18 16V8L22 12Z"></path>
    </svg>
);

export const MoveIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={MoveIconSvg} {...props} />;