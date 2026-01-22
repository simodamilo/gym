import ContentLoader from "react-content-loader";

const MySkeleton = () => (
    <ContentLoader speed={2} width={400} height={160} viewBox="0 0 400 160" backgroundColor="#FFFFFF" foregroundColor="#ecebeb">
        {/* Rectangles, circles, paths */}
        <rect x="0" y="0" rx="5" ry="5" width="400" height="20" /> {/* Title */}
        <rect x="0" y="30" rx="5" ry="5" width="350" height="15" /> {/* Subtitle */}
        <rect x="0" y="30" rx="5" ry="5" width="350" height="15" /> {/* Subtitle */}
        <rect x="0" y="30" rx="5" ry="5" width="350" height="15" /> {/* Subtitle */}
    </ContentLoader>
);

export default MySkeleton;
