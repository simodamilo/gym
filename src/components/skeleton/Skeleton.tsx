import ContentLoader from "react-content-loader";

const MySkeleton = () => (
    <ContentLoader speed={2} width={400} height={160} viewBox="0 0 400 160" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
        {/* Rectangles, circles, paths */}
        <rect x="0" y="0" rx="5" ry="5" width="400" height="20" /> {/* Title */}
        <rect x="0" y="30" rx="5" ry="5" width="350" height="15" /> {/* Subtitle */}
        <rect x="0" y="60" rx="5" ry="5" width="380" height="15" /> {/* Text line */}
        <rect x="0" y="90" rx="5" ry="5" width="300" height="15" /> {/* Text line */}
        <circle cx="20" cy="140" r="15" /> {/* Avatar */}
        <rect x="50" y="130" rx="5" ry="5" width="330" height="20" /> {/* Bottom line */}
    </ContentLoader>
);

export default MySkeleton;
