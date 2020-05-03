declare module 'react-image-mapper' {
    export interface Path {
        circle?: {
            color?: string
            radius?: number
        };
        line?: {
            color?: string;
            strokeWidth?: number
        };
        steps?: number[][]
    }
    export interface Area {
        scaledCoords?: number[]
        coords?: number[]
        href?: string
        shape?: string
        preFillColor?: string
        fillColor?: string
        center?: number[]
        name?: string
    }
    export interface Map {
        areas?: Area[]
        name?: string
    }
    export interface ImageMapperProps {
        src: string
        active?: boolean
        fillColor?: string
        height?: number
        imgHeight?: number
        imgWidth?: number
        lineWidth?: number
        strokeColor?: string
        width?: number
        paths?: Path[]
        hoveredAreas?: Area[]
        href?: string
        shape?: string
        preFillColor?: string
        fillColor?: string
        strokeColor?: string

        onClick?: any
        onMouseMove?: any
        onMouseDown?: any
        onMouseUp?: any
        onImageClick?: any
        onImageMouseMove?: any
        onImageMouseDown?: any
        onImageMouseUp?: any
        onLoad?: any
        onExtendedAreasCreated?: any
        onMouseEnter?: any
        onMouseLeave?: any
        map?: Map
    }

    declare class ImageMapper extends React.PureComponent<ImagerMapperProps> {
        static defaultProps: ImagerMapperProps;
        render: any;
    }
    export default ImageMapper;
}