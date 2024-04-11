interface headerType {
    title: {
        text: string;
    };
    subtitle: {
        text: string;
    };
    breadcrumb: {
        name: string;
        path: string;
    }[];
}
declare const Title: ({ header }: {
    header: headerType;
}) => import("react/jsx-runtime").JSX.Element;
export default Title;
//# sourceMappingURL=PreviewTitle.d.ts.map