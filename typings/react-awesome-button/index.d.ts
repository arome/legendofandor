declare module 'react-awesome-button' {
    interface AwesomeButtonProps {
        action?(): void;
        active?: boolean;
        blocked?: boolean;
        children?: React.ReactNode;
        className?: string;
        cssModule?: object;
        disabled?: boolean;
        element?(): void;
        href?: string;
        moveEvents?: boolean;
        onPress?(): void;
        onReleased?(): void;
        placeholder?: boolean;
        ripple?: boolean;
        rootElement?: string;
        size?: string;
        style?: object;
        target?: string;
        title?: string;
        to?: string;
        type?: string;
        visible?: boolean;
    }

    export class AwesomeButton extends React.PureComponent<AwesomeButtonProps> { }
}

declare module 'react-awesome-button/src/styles/themes/theme-blue' {
    export const awsBtn: string;
    export const awsBtnWrapper: string;
    export const awsBtnContent: string;
    export const awsBtnProgress: string;
    export const awsBtnFacebook: string;
    export const awsBtnMessenger: string;
    export const awsBtnTwitter: string;
    export const awsBtnLinkedin: string;
    export const awsBtnWhatsapp: string;
    export const awsBtnGithub: string;
    export const awsBtnReddit: string;
    export const awsBtnPinterest: string;
    export const awsBtnGplus: string;
    export const awsBtnYoutube: string;
    export const awsBtnMail: string;
    export const awsBtnInstagram: string;
    export const awsBtnPrimary: string;
    export const awsBtnActive: string;
    export const awsBtnSecondary: string;
    export const awsBtnLink: string;
    export const awsBtnDisabled: string;
    export const awsBtnPlaceholder: string;
    export const placeholder: string;
    export const awsBtnVisible: string;
    export const awsBtnLeft: string;
    export const awsBtnRight: string;
    export const awsBtnMiddle: string;
    export const awsBtnIcon: string;
    export const awsBtnOff: string;
    export const awsBtnSmall: string;
    export const awsBtnMedium: string;
    export const awsBtnLarge: string;
    export const awsBtnFill: string;
    export const awsBtnBubble: string;
    export const bubblePing: string;
    export const awsBtnStart: string;
    export const awsBtnErrored: string;
    export const awsBtnEnd: string;
    export const bounce: string;
}