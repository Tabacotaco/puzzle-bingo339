import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import '../../assets/css/Territories.scss';


// TODO: Custom Function
const emptyNumbers = ['', '', '', '', '', '', '', '', ''];

const defaultZones = {
  "0": { bgClass: 'zone-bg-1', numbers: emptyNumbers },
  "1": { bgClass: 'zone-bg-2', numbers: emptyNumbers },
  "2": { bgClass: 'zone-bg-3', numbers: emptyNumbers },
  "3": { bgClass: 'zone-bg-4', numbers: emptyNumbers },
  "4": { bgClass: 'zone-bg-5', numbers: emptyNumbers },
  "5": { bgClass: 'zone-bg-6', numbers: emptyNumbers },
  "6": { bgClass: 'zone-bg-7', numbers: emptyNumbers },
  "7": { bgClass: 'zone-bg-8', numbers: emptyNumbers },
  "8": { bgClass: 'zone-bg-9', numbers: emptyNumbers }
};

function useTerritories({ cursor }) {
  const [ cursorOn, setCursorOn ] = useState({ show: false, clientX: 0, clientY: 0 });

  return {
    cursorOn,

    onHoverCursor: useCallback(show => e => !cursor ? null : setCursorOn({
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
    }), [ cursor ])
  };
}


// TODO: Territories Component
export default function Territories({
  cursor,
  mode,
  className      = '',
  hoverOn        = 'cell',
  isSelecting    = false,
  onSelected = () => {},
  zones          = defaultZones
}) {
  const { cursorOn: { show, clientX, clientY, hoverX, hoverY, hoverZ }, onHoverCursor } = useTerritories({ cursor });

  return (
    <BsContainer className={`territories ${ className } ${ mode }-${ hoverOn }`} padding={ 0 } options={{
      'data-hover-x' : hoverX,
      'data-hover-y' : hoverY,
      'data-hover-z' : hoverZ,
      onMouseMove    : onHoverCursor(true),
      onMouseLeave   : onHoverCursor(false)
    }}>
      { !show || !cursor ? null : (
        <img className="cursor" alt="cursor" src={ cursor } style={{ top: clientY, left: clientX }} />
      )}

      <BsRow align="center">
        { Object.keys(zones).map(zone => ({ ...zones[zone], zone })).map(({ zone, numbers, bgClass }) => (
          <BsCol key={`zone-${ zone }`} className={`container zone ${ bgClass }`} padding={ 0 } margin={ 0 } width={ 4 } border rounded>
            <BsRow margin={ 1 } options={{ style: { opacity: isSelecting ? 1 : .8 }}}>
              { numbers.map((num, i) => (
                <BsCol rounded border {...{
                  key        : `number-${ num || i }`,
                  tagName    : isSelecting ? 'button' : 'div',
                  className  : 'bingo-number text-center',
                  width      : 4,
                  padding    : 0,
                  options    : (({ x, y }) => ({
                    'data-x' : x,
                    'data-y' : y,
                    'data-z' : zone,
                    ...(!isSelecting ? {} : { onClick: () => onSelected({ number: num, x, y, z: zone })})
                  }))({
                    x: parseFloat(zone) % 3 * 3 + i % 3,
                    y: Math.floor(parseFloat(zone) / 3) * 3 + Math.floor(i / 3)
                  })
                }}>
                  { num }
                </BsCol>
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
    PropTypes.exact({
      "0": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      "1": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      "2": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      "3": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      "4": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      "5": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      "6": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      "7": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired,
      "8": PropTypes.exact({
        bgClass: PropTypes.string.isRequired,
        numbers: PropTypes.arrayOf(PropTypes.number)
      }).isRequired
    })
  ])
};
