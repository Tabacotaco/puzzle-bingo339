import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import $ from 'jquery';

import { useI18n } from '../../services/i18n';
import { GameCustom } from '../../services/game';
import { EffectsType, TerritoryZoneType } from './options.type';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import '../../assets/css/Territories.scss';


// TODO: Custom Function
const empty = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

const defaultZones = {
  0: { bgClass: 'zone-bg-1' },
  1: { bgClass: 'zone-bg-2' },
  2: { bgClass: 'zone-bg-3' },
  3: { bgClass: 'zone-bg-4' },
  4: { bgClass: 'zone-bg-5' },
  5: { bgClass: 'zone-bg-6' },
  6: { bgClass: 'zone-bg-7' },
  7: { bgClass: 'zone-bg-8' },
  8: { bgClass: 'zone-bg-9' }
};

function useTerritories({ cursor, mode, defenses }) {
  const { get } = useI18n();
  const [ cursorOn, setCursorOn ] = useState({ show: false, clientX: 0, clientY: 0 });
  const [ territoriesID ] = useState(uuidv4());

  useEffect(() => {
    if (Object.keys(defenses).length > 0) $(`#${ territoriesID }`).find('.defense-icons').each(
      (i, el) => $(el).popover({
        title     : get('TERRITORIES_TITLE_DEFENSES'),
        container : 'body',
        toggle    : 'popover',
        html      : true,
        trigger   : 'hover',
        placement : 'bottom',
        content   : defenses[`${ $(el).attr('data-x') }-${ $(el).attr('data-y') }`].map(
          card => `<img alt="defense-icon" class="defense-icon" src="${ GameCustom.useCardImage(card) }" />`
        ).join('')
      })
    );
  });

  return {
    territoriesID,
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
  defenses    = false,
  onSelected  = () => {},
  options: {
    i, z,
    number = '',
    x      = parseFloat(z) % 3 * 3 + i % 3,
    y      = Math.floor(parseFloat(z) / 3) * 3 + Math.floor(i / 3)
  }
}) {
  return (
    <BsCol rounded border {...{
      tagName    : isSelecting ? 'button' : 'div',
      className  : `bingo-number text-center ${ !defenses ? '' : 'defense-icons' }`,
      width      : 4,
      padding    : 0,
      options    : {
        'data-x' : x,
        'data-y' : y,
        'data-z' : z,
        ...(!isSelecting ? {} : { onClick: () => onSelected({ number, x, y, z })})
      }
    }}>
      { number }
    </BsCol>
  );
}


// TODO: Territories Component
export default function Territories({
  cursor,
  mode,
  defenses    = {},
  className   = '',
  hoverOn     = 'cell',
  isSelecting = false,
  onSelected  = () => {},
  zones       = defaultZones
}) {
  const {
    territoriesID,
    onHoverCursor,
    cursorOn: { show, clientX, clientY, hoverX, hoverY, hoverZ }
  } = useTerritories({ cursor, mode, defenses });
console.log(zones);
  return (
    <BsContainer padding={ 0 } options={{
      id             : territoriesID,
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
        { Object.keys(zones).map(z => ({ ...zones[z], z })).map(({ z, numbers = empty, bgClass }) => (
          <BsCol key={`zone-${ z }`} className={`container zone ${ bgClass }`} padding={ 0 } margin={ 0 } width={ 4 } border rounded>
            <BsRow margin={ 1 } options={{ style: { opacity: isSelecting ? 1 : .8 }}}>
              { numbers.map(({ x, y, number }, i) => (
                <Land key={`number-${ number || i }`} {...{
                  options  : { number, x, y, z, i },
                  defenses : defenses[`${ x }-${ y }`],
                  isSelecting,
                  onSelected
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
  defenses    : PropTypes.shape({
    [ PropTypes.string.isRequired ]: EffectsType
  }),
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
