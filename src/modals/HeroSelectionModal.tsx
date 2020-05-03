import React from 'react'
import { Modal, Button, Icon } from 'semantic-ui-react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { HeroSelectionModalProps } from '../models/Modal'

const images: string[] = []
const heroes = ['Archer', 'Dwarf', 'Mage', 'Warrior']
heroes.forEach((hero) => {
  images.push(require(`../assets/images/characters/cards/${hero}_male.jpg`))
  images.push(require(`../assets/images/characters/cards/${hero}_female.jpg`))
})

export default (props: HeroSelectionModalProps) => {
  return (
    <Modal className="hero-selection-modal" open={props.open} onClose={() => props.handleClose()} closeIcon>
      <Modal.Header>Hero Selection</Modal.Header>
      <Modal.Content>
        <Carousel>
          {images.map((image: string, key) => {
            const regex = /[\w]+(?=\.)/
            const match = image.match(regex)
            const hero = match ? match[0] : ''
            const heroSplit = hero.split('_')
            const heroType = heroSplit[0].charAt(0).toUpperCase() + heroSplit[0].substring(1)
            const heroGender = heroSplit[1].charAt(0).toUpperCase() + heroSplit[1].substring(1)
            return (
              <div key={key}>
                <img src={image} alt={`${heroGender} ${heroType}`} />
                <Button
                  className="legend"
                  onClick={() => {
                    props.setHeroLoader(true)
                    props.selectHero(hero)
                    props.handleClose()
                  }}
                >
                  Select {heroType} <Icon name={heroGender === 'Male' ? 'man' : 'woman'} />
                </Button>
              </div>
            )
          })}
        </Carousel>
      </Modal.Content>
    </Modal>
  )
}
