import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from '../../services/i18n';

import BsCard, { BsCardHeader, BsCardBody, BsCardTitle, BsCardText } from '../bs/Card';

import attack_bomb from '../../assets/imgs/attack-bomb.png';
import attack_fog from '../../assets/imgs/attack-fog.png';
import attack_lock from '../../assets/imgs/attack-lock.png';
import defense_bomb from '../../assets/imgs/defense-bomb.png';
import defense_fog from '../../assets/imgs/defense-fog.png';
import defense_lock from '../../assets/imgs/defense-lock.png';
import defense_mirror from '../../assets/imgs/defense-mirror.png';


// TODO: Custom Function
const imgs = {
  defense_bomb , attack_bomb ,
  defense_fog  , attack_fog  ,
  defense_lock , attack_lock ,
  defense_mirror
};

function useCustomCard(card) {
  const { rangeX: x, rangeY: y, ranges } = card;

  return {
    bgClass      : useMemo(() => 'ATTACK' === card.type ? 'bg-teal' : 'bg-warning', [ card ]),
    ranges       : useMemo(() => !ranges ? [{ x, y }] : ranges, [ x, y, ranges ]),
    getCardImage : useCallback(
      ({ description, type }) => imgs[`${ type.toLowerCase() }_${ description.toLowerCase() }`],
      []
    )
  };
}


// TODO: Component
export default function GameCard({ card }) {
  const { get } = useI18n();
  const { type, description, count = 0 } = card;
  const { bgClass, ranges, getCardImage } = useCustomCard(card);

  return (
    <BsCard className={`card-info text-dark ${ bgClass }`} image={ getCardImage(card) }>
      <BsCardHeader className="font-weight-bolder text-shadow-sm-dark">
        <i className="fa fa-magic mr-2" />
        { get(`CARD_TITLE_FOR_${ type }`) }
      </BsCardHeader>

      <BsCardBody>
        <BsCardTitle className="font-weight-bolder text-shadow-sm-dark">
          { get(`CARD_NAME_${ type }_${ description }`) }
        </BsCardTitle>

        { !count ? null : (
          <BsCardText>
            <label className="font-weight-bolder mr-2">
              { get('CARD_LABEL_COUNT') }:
            </label>

            { count }
          </BsCardText>
        )}

        <BsCardText>
          <label className={`font-weight-bolder mr-2 ${ ranges.lengnth > 1 ? 'd-block' : '' }`}>
            { get('CARD_LABEL_RANGE') }:
          </label>

          { ranges.map(({ x, y }, i) => (
            <span key={`range-${ i }`} className={ ranges.lengnth > 1 ? 'd-block' : '' }>
              { x } &times; { y }
            </span>
          ))}
        </BsCardText>

        <BsCardText>
          <label className="font-weight-bolder d-block mr-2">
            { get('CARD_LABEL_DESC') }:
          </label>

          { get(`CARD_DESC_${ type }_${ description }`) }
        </BsCardText>
      </BsCardBody>
    </BsCard>
  );
};

GameCard.propTypes = {
  card: PropTypes.exact({
    type        : PropTypes.oneOf([ 'ATTACK', 'DEFENSE' ]).isRequired,
    description : PropTypes.oneOf([ 'BOMB', 'FOG', 'LOCK', 'MIRROR' ]).isRequired,
    count       : PropTypes.number,
    rangeX      : PropTypes.oneOf([ 1, 3, 9 ]),
    rangeY      : PropTypes.oneOf([ 1, 3, 9 ]),
    ranges      : PropTypes.arrayOf(
      PropTypes.exact({
        rangeX  : PropTypes.oneOf([ 1, 3, 9 ]).isRequired,
        rangeY  : PropTypes.oneOf([ 1, 3, 9 ]).isRequired
      })
    )
  }).isRequired
};
