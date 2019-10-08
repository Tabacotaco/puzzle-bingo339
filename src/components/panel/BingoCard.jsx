import React, { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from '../../services/i18n';
import { useGame, useAttackRange } from '../../services/game';
import { useCurrentRound } from '../../services/custom/game';

import BsCard, { BsCardHeader, BsCardBody, BsCardFooter, BsCardTitle, BsCardText } from '../bs/Card';
import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import Territories from './Territories';

import attack_bomb from '../../assets/imgs/attack-bomb.png';
import attack_fog from '../../assets/imgs/attack-fog.png';
import attack_lock from '../../assets/imgs/attack-lock.png';
import defense_bomb from '../../assets/imgs/defense-bomb.png';
import defense_fog from '../../assets/imgs/defense-fog.png';
import defense_lock from '../../assets/imgs/defense-lock.png';
import defense_mirror from '../../assets/imgs/defense-mirror.png';

import '../../assets/css/BingoCard.scss';


// TODO: Custom Function
const imgs = {
  defense_bomb , attack_bomb ,
  defense_fog  , attack_fog  ,
  defense_lock , attack_lock ,
  defense_mirror
};

function useDashboard({ card }) {
  const { gameID, dispatch } = useGame();
  const [ image, setImage ] = useState();
  const attackRange = useAttackRange(card);

  return {
    attackRange,
    usingCardImage : image,

    onGetCard      : useCallback(() => dispatch({ step: 2 }), [ dispatch ]),

    onUseCard      : useCallback(({ img }) => {
      dispatch({ step: 3 });
      setImage(img);
    }, [ dispatch ]),

    doAttack       : useCallback(({ x, y, z }) => dispatch({
      action : 'LAUNCH_ATTACK',
      target : attackRange,
      gameID, card, x, y, z,
      onSuccess(content) {
        console.log(content);
      }
    }), [ gameID, attackRange, card, dispatch ])
  };
}

function useBingoCard({ card, onUseCard }) {
  const { rangeX: x, rangeY: y, ranges } = card;

  return {
    bgClass : useMemo(() => 'ATTACK' === card.type ? 'bg-teal' : 'bg-warning', [ card ]),
    ranges  : useMemo(() => !ranges ? [{ x, y }] : ranges, [ x, y, ranges ]),

    doUseCard: useCallback(
      () => onUseCard({ ...card, img: imgs[`${ card.type.toLowerCase() }_${ card.description.toLowerCase() }`] }),
      [ onUseCard, card ]
    ),
    getCardImage: useCallback(
      ({ description, type }) => imgs[`${ type.toLowerCase() }_${ description.toLowerCase() }`],
      []
    )
  };
}


// TODO: Component - CardDashboard
export function CardDashboard() {
  const { get } = useI18n();
  const { step, card } = useCurrentRound();
  const { attackRange, usingCardImage, onGetCard, onUseCard, doAttack } = useDashboard({ card });

  return step === 1 ? (
    <BsContainer className="center-message shadow-light" padding={ 3 } colors={{ bg: 'warning', text: 'dark' }}>
      <BsRow align="center" padding={{ x: 2 }}>
        <BsCol className="text-center" width={ 12 }>
          { get('MSG_STEP_GET_CARD') }
        </BsCol>

        <BsCol className="text-center" width={ 12 } margin={{ t: 3 }}>
          <button type="button" className="btn btn-dark" onClick={ onGetCard }>
            <i className="fa fa-magic mr-2" />{ get('BTN_GET_CARD') }
          </button>
        </BsCol>
      </BsRow>
    </BsContainer>

  ) : step === 2 ? (
    <BingoCard card={ card } onUseCard={ onUseCard } />

  ) : step === 3 && 'ATTACK' === card.type ? (
    <div className="competitor-territories">
      <h3 className="text-center bg-warning text-dark font-weight-bolder mt-3 py-3">
        { get('MSG_ATTACK_COMPETITOR') }
      </h3>

      <Territories isSelecting mode="attack" hoverOn={ attackRange } cursor={ usingCardImage }
        onSelected={ doAttack } />
    </div>

  ) : null;
}


// TODO: Component - BingoCard
export default function BingoCard({ card, onUseCard = () => {} }) {
  const { get } = useI18n();
  const { type, description, count = 0 } = card;
  const { bgClass, ranges, getCardImage, doUseCard } = useBingoCard({ card, onUseCard });

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
