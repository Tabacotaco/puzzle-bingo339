import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from '../../services/i18n';
import { GameCustom } from '../../services/game';

import BsCard, { BsCardHeader, BsCardBody, BsCardFooter, BsCardTitle, BsCardText } from '../bs/Card';

import '../../assets/css/BingoCard.scss';


// TODO: Custom Function
function useBingoCard({ card, onUseCard }) {
  const { rangeX: x, rangeY: y, ranges } = card;

  return {
    bgClass   : useMemo(() => 'ATTACK' === card.type ? 'bg-teal' : 'bg-warning', [ card ]),
    ranges    : useMemo(() => !ranges ? [{ x, y }] : ranges, [ x, y, ranges ]),
    doUseCard : useCallback(() => onUseCard(card), [ onUseCard, card ])
  };
}


// TODO: Component - BingoCard
export default function BingoCard({ card, onUseCard = () => {} }) {
  const { get } = useI18n();
  const { type, description, count = 0 } = card;
  const { bgClass, ranges, doUseCard } = useBingoCard({ card, onUseCard });

  return (
    <BsCard className={`card-info text-dark ${ bgClass }`} image={ GameCustom.useCardImage(card) }>
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

      { count ? null : (
        <BsCardFooter className="text-center">
          <button type="button" className="btn btn-dark" onClick={ doUseCard }>
            <i className="fa fa-map-marker mr-2" />{ get('BTN_USE_CARD') }
          </button>
        </BsCardFooter>
      )}
    </BsCard>
  );
};

BingoCard.propTypes = {
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
  }).isRequired ,
  onUseCard     : PropTypes.func
};
