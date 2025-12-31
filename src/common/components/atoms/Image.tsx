import Image, { ImageProps } from "next/image"

interface WondrrImageProps extends Omit<ImageProps, 'src'> {
    src: string;
}

const MyImage = ({src, alt, ...props}: WondrrImageProps) => {
    return (
        <Image
            src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${src}`}
            alt={alt || 'Some Trip Image'}
            {...props}
        />
    )
}

export default MyImage;