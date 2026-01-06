import Image, { ImageProps } from "next/image"

interface WondrrImageProps extends Omit<ImageProps, 'src'> {
    src: string;
}

const MyImage = ({src, alt, ...props}: WondrrImageProps) => {
    return (
        <Image
            src={`${src.startsWith('/') ? (process.env.NEXT_PUBLIC_CLOUDFRONT_URL+src) : src }`}
            alt={alt || 'Some Trip Image'}
            {...props}
            unoptimized
        />
    )
}

export default MyImage;