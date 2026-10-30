import badminton from '../assets/courts/badminton.jpg';
import pickleball from '../assets/courts/pickleball.jpg';

const SPORT_IMAGES = {
  'Cầu lông': badminton,
  Pickleball: pickleball,
};

const FALLBACK = badminton;

export function sportImage(sportName) {
  return SPORT_IMAGES[sportName] ?? FALLBACK;
}

