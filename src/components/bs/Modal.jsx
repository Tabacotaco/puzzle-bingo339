import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { useI18n } from '../../services/i18n';

import { getColorClasses } from './options.fn';
import { BsContainerColor, BsChildren, BsBtnColors, CLOSE_MODAL } from './options.type';


// TODO: Events
function useEvents({ isShow, setShow, backdrop, onShow, handler }) {
  const handlerFn = useCallback(code => () => handler(code) ? null : setShow(false), [ setShow, handler ]);

  useEffect(() => { if (isShow) onShow(); });

  return {
    doCloseModal: useCallback(() => handlerFn(CLOSE_MODAL)(), [ handlerFn ]),

    onHandler: handlerFn,

    onClickBackdrop: useCallback(
      e => 'static' === backdrop || !$(e.target).hasClass('puzzle-bingo-bs') ? null : handlerFn(CLOSE_MODAL)(),
      [ backdrop, handlerFn ]
    )
  };
}

// TODO: Components
export default function BsModal({
  children,
  size = 'default',
  show: [ isShow, setShow ],
  colors,
  backdrop,
  icon = '',
  title = '',
  btns = [],
  handler = () => {},
  onShow = () => {}
}) {
  const { get } = useI18n();
  const { doCloseModal, onHandler, onClickBackdrop } = useEvents({ isShow, setShow, backdrop, onShow, handler });

  return !isShow ? null : (
    <div className="puzzle-bingo-bs modal fade show" onClick={ onClickBackdrop }>
      <div className={ `modal-dialog ${ 'default' === size ? '' : `modal-${ size }` }` }>
        <div className={ `modal-content ${ getColorClasses(colors) }` }>

          {/* TODO: Header */}
          { !title ? null : (
            <div className="modal-header">
              <h5 className="modal-title">
                { !icon ? null : <i className={ `mr-2 ${icon}` } /> }
                { get(title) }
              </h5>

              { 'static' === backdrop ? null : (
                <button type="button" className="close" onClick={ doCloseModal }>
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
          )}

          {/* TODO: Body */}
          <div className="modal-body">
            { children }
          </div>

          {/* TODO: Footer Buttons */}
          { btns.length === 0 ? null : (
            <div className="modal-footer">
              { btns.map(({ icon: btnIcon, text, code = CLOSE_MODAL, color = 'secondary' }) =>
                <button type="button" className={ `btn btn-${ color }` } onClick={ onHandler(code) }>
                  { !btnIcon ? null : <i className={ `mr-2 ${ btnIcon }` } />}
                  { get(text) }
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BsModal.propTypes = {
  children : BsChildren,
  size     : PropTypes.oneOf([ 'default', 'sm', 'lg', 'xl' ]),
  icon     : PropTypes.string,
  title    : PropTypes.string,
  show     : PropTypes.array.isRequired,
  backdrop : PropTypes.oneOf([ 'static' ]),
  colors   : BsContainerColor,
  handler  : PropTypes.func,
  onShow   : PropTypes.func,
  btns     : PropTypes.arrayOf(PropTypes.exact({
    icon   : PropTypes.string,
    text   : PropTypes.string,
    color  : BsBtnColors,
    code   : PropTypes.instanceOf(Symbol)
  }))
};
