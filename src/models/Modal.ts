interface ModalProps {
    open: boolean
    handleClose?: any
}
export interface CreateGameModalProps extends ModalProps { }
export interface JoinGameModalProps extends ModalProps { }
export interface ResourceSplitProps extends ModalProps {
    current: { [key: number]: { gold?: number, wineskin?: number } }
    total: { gold?: number, wineskin?: number }
    names: string[]
    add(type: 'gold' | 'wineskin', quantity: number, id: number): void
    splitResource(): any
}
export interface PlayerNameModalProps extends ModalProps {
    playerID: any
    joinGame(id: number, name: string): void
}
export interface HeroSelectionModalProps extends ModalProps {
    setHeroLoader(loader: boolean): void
    selectHero(hero: string): void
}
