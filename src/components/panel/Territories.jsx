import React, { createElement, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { useI18n } from '../../services/i18n';
import { GameCustom } from '../../services/game';
import { DefaultZones, EmptyNumbers, TerritoryZoneType } from './options.type';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import '../../assets/css/Territories.scss';


// TODO: Custom Function
function useLand({ isSelecting, number, effects = {} }) {
  const { get } = useI18n();
  const { built = false, stong = false, fog = false, occupied = false, mirror = false } = effects;

  const landRef     = useRef();
  const prevEffects = useRef();
  const { current: $effects } = prevEffects || {};

  const isDefensing = useMemo(() => stong || mirror, [ stong, mirror ]);
  const tipContent  = useMemo(
    () => `
      ${ !stong  ? '' : `<img alt="stong-house" class="defense-icon" src="${ GameCustom.useCardImage({ type: 'DEFENSE', description: 'BOMB' }) }" />` }
      ${ !mirror ? '' : `<img alt="mirror" class="defense-icon" src="${ GameCustom.useCardImage({ type: 'DEFENSE', description: 'MIRROR' }) }" />` }
    `,
    [ stong, mirror ]
  );
  
  useEffect(() => {
    if (isDefensing) $(landRef.current).popover({
      title   : get('TERRITORIES_TITLE_DEFENSES') ,
      toggle  : 'popover'  , container : 'body'   ,
      html    : true       , trigger   : 'hover'  ,
      content : tipContent , placement : 'bottom'
    });
    prevEffects.current = { $built: built, $stong: stong, $fog: fog, $occupied: occupied, $mirror: mirror };
  });

  return {
    landRef,

    selectable  : useMemo(() => isSelecting && (fog || !occupied || !built), [ isSelecting, fog, occupied, built ]),

    displayText : useMemo(() =>  fog || occupied ? '' : number, [ fog, occupied, number ]),

    className   : useMemo(
      () => `p-0 col-4 rounded border bingo-number text-center ${
        fog ? 'poison-fog' : occupied ? 'occupied' : !built ? '' : stong ? 'built-stong' : 'built-house'
      }`,
      [ fog, occupied, stong, built ]
    ),

    animation   : useMemo(() => {
      const { $built = false, $stong = false, $fog = false, $occupied = false, $mirror = false } = $effects || {};

      if ($mirror && !mirror)
        return 'mirror-trigger-shown 2 .8s linear';
      else if (!$mirror && mirror)
        return 'mirror-set 1 .6s linear';
      else if ($fog && !fog)
        return 'poison-fog-hidden 1 .8s linear';
      else if ($occupied && !occupied)
        return 'unoccupied-shown';
      else if ($stong && !stong)
        return 'stong-destroyed';
      else if ($built && !built)
        return 'house-destroyed';

      return undefined;
    }, [ $effects, built, stong, fog, occupied, mirror ]) 
  };
}

function useTerritories({ cursor, mode }) {
  const [ cursorOn, setCursorOn ] = useState({ show: false, clientX: 0, clientY: 0 });

  return {
    cursorOn,

    onHoverCursor: useCallback(show => e => !cursor && mode !== 'switch' ? null : setCursorOn({
      show,
      clientX: e.clientX,
      clientY: e.clientY,
      ...(!show ? {} : (el => {
        if (!el.classList.contains('bingo-number'))
          return {};

        return {
          hoverX: el.getAttribute('data-x'),
          hoverY: el.getAttribute('data-y'),
          hoverZ: el.getAttribute('data-z')
        };
      })(document.elementFromPoint(e.clientX, e.clientY)))
    }), [ cursor, mode ])
  };
}


// TODO: Private Component
function Land({
  isSelecting = false,
  onSelected  = () => {},
  effects,
  options: {
    i, z,
    n = '',
    x = parseFloat(z) % 3 * 3 + i % 3,
    y = Math.floor(parseFloat(z) / 3) * 3 + Math.floor(i / 3)
  }
}) {
  const { selectable, landRef, displayText, className, animation } = useLand({ isSelecting, number: n, effects });

  return createElement(selectable ? 'button' : 'div', {
    ref: landRef,
    className,
    style: { animation },
    'data-x' : x,
    'data-y' : y,
    'data-z' : z,
    ...(!selectable ? {} : { onClick: () => onSelected({ number: n, x, y, z })})
  }, displayText);
}


// TODO: Territories Component
export default function Territories({
  cursor,
  mode,
  zones       = DefaultZones,
  className   = '',
  hoverOn     = 'cell',
  isMime      = false,
  isSelecting = false,
  onSelected  = () => {}
}) {
  const {
    onHoverCursor,
    cursorOn: { show, clientX, clientY, hoverX, hoverY, hoverZ }
  } = useTerritories({ cursor, mode });

  return (
    <BsContainer padding={ 0 } options={{
      'data-hover-x' : hoverX,
      'data-hover-y' : hoverY,
      'data-hover-z' : hoverZ,
      onMouseMove    : onHoverCursor(true),
      onMouseLeave   : onHoverCursor(false)
    }} className={`territories ${ className } ${ mode }-${ 'switch' === mode ? 'zone' : hoverOn }`}>
      { !show || !cursor ? null : (
        <img className="cursor" alt="cursor" src={ cursor } style={{ top: clientY, left: clientX }} />
      )}

      <BsRow align="center">
        { Object.keys(zones).map(z => ({ ...zones[z], z })).map(({ z, numbers = EmptyNumbers, bgClass }) => (
          <BsCol key={`zone-${ z }`} className={`container zone ${ bgClass }`} padding={ 0 } margin={ 0 } width={ 4 } border rounded>
            <BsRow margin={ 1 } options={{ style: { opacity: isSelecting ? 1 : .8 }}}>
              { numbers.map(({ x, y, number, effects }, i) => (
                <Land key={`number-${ number || i }`} {...{
                  isSelecting , options : { n: number, x, y, z, i },
                  onSelected  , effects : isMime ? effects : undefined
                }} />
              ))}
            </BsRow>
          </BsCol>
        ))}
      </BsRow>
    </BsContainer>
  );
};

Territories.propTypes = {
  className   : PropTypes.string,
  isSelecting : PropTypes.bool,
  mode        : PropTypes.oneOf([ 'attack', 'defense', 'build', 'switch' ]).isRequired,
  hoverOn     : PropTypes.oneOf([ 'cell', 'line-x', 'line-y', 'zone' ]),
  cursor      : PropTypes.string,
  onSelected  : PropTypes.func,
  zones       : PropTypes.oneOfType([
    PropTypes.exact({}),
    PropTypes.shape({
      0: TerritoryZoneType,
      1: TerritoryZoneType,
      2: TerritoryZoneType,
      3: TerritoryZoneType,
      4: TerritoryZoneType,
      5: TerritoryZoneType,
      6: TerritoryZoneType,
      7: TerritoryZoneType,
      8: TerritoryZoneType
    })
  ])
};
