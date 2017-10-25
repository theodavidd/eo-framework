'use strict';

if ( ! window.eoxiaJS ) {
	window.eoxiaJS = {};
	window.eoxiaJS.scriptsLoaded = false;
}

if ( ! window.eoxiaJS.scriptsLoaded ) {
	window.eoxiaJS.init = function() {
		window.eoxiaJS.load_list_script();
		window.eoxiaJS.init_array_form();
	};

	window.eoxiaJS.load_list_script = function() {
		if ( ! window.eoxiaJS.scriptsLoaded ) {
			var key = undefined, slug = undefined;
			for ( key in window.eoxiaJS ) {

				if ( window.eoxiaJS[key].init ) {
					window.eoxiaJS[key].init();
				}

				for ( slug in window.eoxiaJS[key] ) {

					if ( window.eoxiaJS[key][slug].init ) {
						window.eoxiaJS[key][slug].init();
					}

				}
			}

			window.eoxiaJS.scriptsLoaded = true;
		}
	};

	window.eoxiaJS.init_array_form = function() {
		 window.eoxiaJS.arrayForm.init();
	};

	window.eoxiaJS.refresh = function() {
		var key = undefined;
		var slug = undefined;
		for ( key in window.eoxiaJS ) {
			if ( window.eoxiaJS[key].refresh ) {
				window.eoxiaJS[key].refresh();
			}

			for ( slug in window.eoxiaJS[key] ) {

				if ( window.eoxiaJS[key][slug].refresh ) {
					window.eoxiaJS[key][slug].refresh();
				}
			}
		}
	};

	jQuery( document ).ready( window.eoxiaJS.init );
}

/**
 * Action for make request AJAX.
 *
 * @since 1.0.0-easy
 * @version 1.1.0-easy
 * @todo Replace the three actions to one.
 */

if ( ! window.eoxiaJS.action ) {
	/**
	 * Declare the object action.
	 *
	 * @since 1.0.0-easy
	 * @version 1.0.0-easy
	 * @type {Object}
	 */
	window.eoxiaJS.action = {};

	/**
	 * This method call the event method
	 *
	 * @since 1.0.0-easy
	 * @version 1.0.0-easy
	 * @return {void}
	 */
	window.eoxiaJS.action.init = function() {
		window.eoxiaJS.action.event();
	};

	/**
	 * This method initialize the click event on three classes.
	 *
	 * @since 1.0.0-easy
	 * @version 1.0.0-easy
	 * @return {void}
	 */
	window.eoxiaJS.action.event = function() {
		jQuery( document ).on( 'click', '.action-input:not(.no-action)', window.eoxiaJS.action.execInput );
		jQuery( document ).on( 'click', '.action-attribute:not(.no-action)', window.eoxiaJS.action.execAttribute );
		jQuery( document ).on( 'click', '.action-delete:not(.no-action)', window.eoxiaJS.action.execDelete );
	};

	/**
	 * Make a request with input value founded inside the parent of the HTML element clicked.
	 *
	 * @param  {MouseEvent} event Properties of element triggered by the MouseEvent.
	 * @since 1.0.0-easy
	 * @version 1.0.0-easy
	 * @return {void}
	 */
	window.eoxiaJS.action.execInput = function( event ) {
		var element = jQuery( this ), parentElement = element, loaderElement = element, listInput = undefined, data = {}, i = 0, doAction = true, key = undefined, inputAlreadyIn = [];
		event.preventDefault();

		if ( element.attr( 'data-loader' ) ) {
			loaderElement = element.closest( '.' + element.attr( 'data-loader' ) );
		}

		if ( element.attr( 'data-parent' ) ) {
			parentElement = element.closest( '.' + element.attr( 'data-parent' ) );
		}

		/** Méthode appelée avant l'action */
		if ( element.attr( 'data-namespace' ) && element.attr( 'data-module' ) && element.attr( 'data-before-method' ) ) {
			doAction = false;
			doAction = window.eoxiaJS[element.attr( 'data-namespace' )][element.attr( 'data-module' )][element.attr( 'data-before-method' )]( element );
		}

		if ( element.hasClass( '.grey' ) ) {
			doAction = false;
		}

		if ( doAction ) {
			loaderElement.addClass( 'loading' );
			listInput = window.eoxiaJS.arrayForm.getInput( parentElement );
			for ( i = 0; i < listInput.length; i++ ) {
				if ( listInput[i].name && -1 === inputAlreadyIn.indexOf( listInput[i].name ) ) {
					inputAlreadyIn.push( listInput[i].name );
					data[listInput[i].name] = listInput[i].value;
				}
			}

			element.get_data( function( attrData ) {
				for ( key in attrData ) {
					data[key] = attrData[key];
				}

				window.eoxiaJS.request.send( element, data );
			} );
		}
	};

	/**
	 * Make a request with data on HTML element clicked.
	 *
	 * @param  {MouseEvent} event Properties of element triggered by the MouseEvent.
	 * @since 1.0.0-easy
	 * @version 1.0.0-easy
	 * @return {void}
	 */
	window.eoxiaJS.action.execAttribute = function( event ) {
	  var element = jQuery( this );
		var doAction = true;
		var loaderElement = element;

		event.preventDefault();

		if ( element.attr( 'data-loader' ) ) {
			loaderElement = element.closest( '.' + element.attr( 'data-loader' ) );
		}

		/** Méthode appelée avant l'action */
		if ( element.attr( 'data-module' ) && element.attr( 'data-before-method' ) ) {
			doAction = false;
			doAction = window.eoxiaJS[element.attr( 'data-namespace' )][element.attr( 'data-module' )][element.attr( 'data-before-method' )]( element );
		}

		if ( element.hasClass( '.grey' ) ) {
			doAction = false;
		}

		if ( doAction ) {
			if ( jQuery( this ).attr( 'data-confirm' ) ) {
				if ( window.confirm( jQuery( this ).attr( 'data-confirm' ) ) ) {
					element.get_data( function( data ) {
						loaderElement.addClass( 'loading' );
						window.eoxiaJS.request.send( element, data );
					} );
				}
			} else {
				element.get_data( function( data ) {
					loaderElement.addClass( 'loading' );
					window.eoxiaJS.request.send( element, data );
				} );
			}
		}

		event.stopPropagation();
	};

	/**
	 * Make a request with data on HTML element clicked with a custom delete message.
	 *
	 * @param  {MouseEvent} event Properties of element triggered by the MouseEvent.
	 * @since 1.0.0-easy
	 * @version 1.0.0-easy
	 * @return {void}
	 */
	window.eoxiaJS.action.execDelete = function( event ) {
		var element = jQuery( this );
		var doAction = true;
		var loaderElement = element;

		event.preventDefault();

		if ( element.attr( 'data-loader' ) ) {
			loaderElement = element.closest( '.' + element.attr( 'data-loader' ) );
		}

		/** Méthode appelée avant l'action */
		if ( element.attr( 'data-namespace' ) && element.attr( 'data-module' ) && element.attr( 'data-before-method' ) ) {
			doAction = false;
			doAction = window.eoxiaJS[element.attr( 'data-namespace' )][element.attr( 'data-module' )][element.attr( 'data-before-method' )]( element );
		}

		if ( element.hasClass( '.grey' ) ) {
			doAction = false;
		}

		if ( doAction ) {
			if ( window.confirm( element.attr( 'data-message-delete' ) ) ) {
				element.get_data( function( data ) {
					loaderElement.addClass( 'loading' );
					window.eoxiaJS.request.send( element, data );
				} );
			}
		}
	};
}

/**
 * Action for make request AJAX.
 *
 * @since 1.0.0-easy
 * @version 1.0.0-easy
 */

if ( ! window.eoxiaJS.arrayForm ) {
	/**
	 * Declare the object arrayForm.
	 *
	 * @since 1.0.0-easy
	 * @version 1.0.0-easy
	 * @type {Object}
	 */
	window.eoxiaJS.arrayForm = {};

	window.eoxiaJS.arrayForm.init = function() {};

	window.eoxiaJS.arrayForm.event = function() {};

	window.eoxiaJS.arrayForm.getInput = function( parent ) {
		return parent.find( 'input, textarea, select' );
	};

	window.eoxiaJS.arrayForm.getInputValue = function( input ) {
		switch ( input.getAttribute( 'type' ) ) {
			case 'checkbox':
				return input.checked;
				break;
			default:
				return input.value;
				break;
		}
	};
}

if ( ! jQuery.fn.get_data ) {
	jQuery.fn.get_data = function( cb ) {
		this.each( function() {
			var data = {};
			var i = 0;
			var localName = undefined;

			for ( i = 0; i <  jQuery( this )[0].attributes.length; i++ ) {
				localName = jQuery( this )[0].attributes[i].localName;
				if ( 'data' === localName.substr( 0, 4 ) || 'action' === localName ) {
					localName = localName.substr( 5 );

					if ( 'nonce' === localName ) {
						localName = '_wpnonce';
					}

					localName = localName.replace( '-', '_' );
					data[localName] =  jQuery( this )[0].attributes[i].value;
				}
			}

			cb( data );
		} );
	};
}

/**
 * Handle date
 *
 * @since 1.0.0-easy
 * @version 1.1.0-easy
 */

if ( ! window.eoxiaJS.date ) {

	window.eoxiaJS.date = {};

	window.eoxiaJS.date.init = function() {
		jQuery( document ).on( 'click', '.group-date .date', function( e ) {
			jQuery( this ).closest( '.group-date' ).find( '.mysql-date' ).datetimepicker( {
				'lang': 'fr',
				'format': 'Y-m-d',
				timepicker: false,
				onChangeDateTime: function( dp, $input ) {
					$input.closest( '.group-date' ).find( '.date' ).val( window.eoxiaJS.date.convertMySQLDate( $input.val(), false ) );

					if ( $input.closest( '.group-date' ).attr( 'data-namespace' ) && $input.closest( '.group-date' ).attr( 'data-module' ) && $input.closest( '.group-date' ).attr( 'data-after-method' ) ) {
						window.eoxiaJS[$input.closest( '.group-date' ).attr( 'data-namespace' )][$input.closest( '.group-date' ).attr( 'data-module' )][$input.closest( '.group-date' ).attr( 'data-after-method' )]( $input );
					}
				}
			} ).datetimepicker( 'show' );
		} );

		jQuery( document ).on( 'click', '.group-date .date-time', function( e ) {
			jQuery( this ).closest( '.group-date' ).find( '.mysql-date' ).datetimepicker( {
				'lang': 'fr',
				'format': 'Y-m-d H:i:s',
				onChangeDateTime: function( dp, $input ) {
					if ( $input.closest( '.group-date' ).find( 'input[name="value_changed"]' ).length ) {
						$input.closest( '.group-date' ).find( 'input[name="value_changed"]' ).val( 1 );
					}
					$input.closest( '.group-date' ).find( '.date-time' ).val( window.eoxiaJS.date.convertMySQLDate( $input.val() ) );

					if ( $input.closest( '.group-date' ).attr( 'data-namespace' ) && $input.closest( '.group-date' ).attr( 'data-module' ) && $input.closest( '.group-date' ).attr( 'data-after-method' ) ) {
						window.eoxiaJS[$input.closest( '.group-date' ).attr( 'data-namespace' )][$input.closest( '.group-date' ).attr( 'data-module' )][$input.closest( '.group-date' ).attr( 'data-after-method' )]( $input );
					}

					$input.closest( '.group-date' ).find( 'div' ).attr( 'aria-label', window.eoxiaJS.date.convertMySQLDate( $input.val() ) );
					// $input.closest( '.group-date' ).find( 'span' ).css( 'background', '#389af6' );
				}
			} ).datetimepicker( 'show' );
		} );
	};

	window.eoxiaJS.date.convertMySQLDate = function( date, time = true ) {
		if ( ! time ) {
			date += ' 00:00:00';
		}
		var timestamp = new Date(date.replace(' ', 'T')).getTime();
		var d = new Date( timestamp );

		var day = d.getDate();
		if ( 1 === day.toString().length ) {
			day = '0' + day.toString();
		}

		var month = d.getMonth() + 1;
		if ( 1 === month.toString().length ) {
			month = '0' + month.toString();
		}

		if ( time ) {
			var hours = d.getHours();
			if ( 1 === hours.toString().length ) {
				hours = '0' + hours.toString();
			}

			var minutes = d.getMinutes();
			if ( 1 === minutes.toString().length ) {
				minutes = '0' + minutes.toString();
			}

			var seconds = d.getSeconds();
			if ( 1 === seconds.toString().length ) {
				seconds = '0' + seconds.toString();
			}

			return day + '/' + month + '/' + d.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds;
		} else {
			return day + '/' + month + '/' + d.getFullYear();
		}
	};
}

if ( ! window.eoxiaJS.form ) {
	window.eoxiaJS.form = {};

	window.eoxiaJS.form.init = function() {
	    window.eoxiaJS.form.event();
	};
	window.eoxiaJS.form.event = function() {
	    jQuery( document ).on( 'click', '.submit-form', window.eoxiaJS.form.submitForm );
	};

	window.eoxiaJS.form.submitForm = function( event ) {
		var element = jQuery( this );
		var doAction = true;

		event.preventDefault();

	/** Méthode appelée avant l'action */
		if ( element.attr( 'data-module' ) && element.attr( 'data-before-method' ) ) {
			doAction = false;
			doAction = window.eoxiaJS[element.attr( 'data-module' )][element.attr( 'data-before-method' )]( element );
		}

		if ( doAction ) {
			element.closest( 'form' ).ajaxSubmit( {
				success: function( response ) {
					if ( response && response.data.module && response.data.callback ) {
						window.eoxiaJS[response.data.module][response.data.callback]( element, response );
					}

					if ( response && response.success ) {
						if ( response.data.module && response.data.callback_success ) {
							window.eoxiaJS[response.data.module][response.data.callback_success]( element, response );
						}
					} else {
						if ( response.data.module && response.data.callback_error ) {
							window.eoxiaJS[response.data.module][response.data.callback_error]( element, response );
						}
					}
				}
			} );
		}
	};
}

if ( ! window.eoxiaJS.global ) {
	window.eoxiaJS.global = {};

	window.eoxiaJS.global.init = function() {};

	window.eoxiaJS.global.downloadFile = function( urlToFile, filename ) {
		var alink = document.createElement( 'a' );
		alink.setAttribute( 'href', urlToFile );
		alink.setAttribute( 'download', filename );
		if ( document.createEvent ) {
			var event = document.createEvent( 'MouseEvents' );
			event.initEvent( 'click', true, true );
			alink.dispatchEvent( event );
		} else {
			alink.click();
		}
	};

	window.eoxiaJS.global.removeDiacritics = function( input ) {
		var output = '';
		var normalized = input.normalize( 'NFD' );
		var i = 0;
		var j = 0;

		while ( i < input.length ) {
			output += normalized[j];

			j += ( input[i] == normalized[j] ) ? 1 : 2;
			i++;
		}

		return output;
	};

	}

/**
 * Handle POPUP
 *
 * @since 1.0.0-easy
 * @version 1.1.0-easy
 */

if ( ! window.eoxiaJS.popup  ) {
	window.eoxiaJS.popup = {};

	window.eoxiaJS.popup.init = function() {
		window.eoxiaJS.popup.event();
	};

	window.eoxiaJS.popup.event = function() {
		jQuery( document ).on( 'keyup', window.eoxiaJS.popup.keyup );
	  jQuery( document ).on( 'click', '.open-popup, .open-popup i', window.eoxiaJS.popup.open );
	  jQuery( document ).on( 'click', '.open-popup-ajax', window.eoxiaJS.popup.openAjax );
	  jQuery( document ).on( 'click', '.popup .container, .digi-popup-propagation', window.eoxiaJS.popup.stop );
	  jQuery( document ).on( 'click', '.popup .container .button.green', window.eoxiaJS.popup.confirm );
	  jQuery( document ).on( 'click', '.popup .close', window.eoxiaJS.popup.close );
	  jQuery( document ).on( 'click', 'body', window.eoxiaJS.popup.close );
	};

	window.eoxiaJS.popup.keyup = function( event ) {
		if ( 27 === event.keyCode ) {
			jQuery( '.popup .close' ).click();
		}
	};

	window.eoxiaJS.popup.open = function( event ) {
		var triggeredElement = jQuery( this );

		if ( triggeredElement.is( 'i' ) ) {
			triggeredElement = triggeredElement.parents( '.open-popup' );
		}

		var target = triggeredElement.closest(  '.' + triggeredElement.data( 'parent' ) ).find( '.' + triggeredElement.data( 'target' ) );
		var cbObject, cbNamespace, cbFunc = undefined;

		if ( target ) {
			target[0].className = 'popup';

			if ( triggeredElement.attr( 'data-class' ) ) {
				target.addClass( triggeredElement.attr( 'data-class' ) );
			}

			target.addClass( 'active' );
		}

		if ( target.is( ':visible' ) && triggeredElement.data( 'cb-namespace' ) && triggeredElement.data( 'cb-object' ) && triggeredElement.data( 'cb-func' ) ) {
			cbNamespace = triggeredElement.data( 'cb-namespace' );
			cbObject = triggeredElement.data( 'cb-object' );
			cbFunc = triggeredElement.data( 'cb-func' );

			// On récupères les "data" sur l'élement en tant qu'args.
			triggeredElement.get_data( function( data ) {
				window.eoxiaJS[cbNamespace][cbObject][cbFunc]( triggeredElement, target, event, data );
			} );
		}

	  event.stopPropagation();
	};

	/**
	 * Ouvre la popup en envoyant une requête AJAX.
	 * Les paramètres de la requête doivent être configurer directement sur l'élement
	 * Ex: data-action="load-workunit" data-id="190"
	 *
	 * @since 1.0.0-easy
	 * @version 1.1.0-easy
	 *
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	window.eoxiaJS.popup.openAjax = function( event ) {
		var element = jQuery( this );
		var callbackData = {};
		var key = undefined;
		var target = jQuery( this ).closest(  '.' + jQuery( this ).data( 'parent' ) ).find( '.' + jQuery( this ).data( 'target' ) );

		/** Méthode appelée avant l'action */
		if ( element.attr( 'data-module' ) && element.attr( 'data-before-method' ) ) {
			callbackData = window.eoxiaJS[element.attr( 'data-namespace' )][element.attr( 'data-module' )][element.attr( 'data-before-method' )]( element );
		}

		if ( target ) {
			target[0].className = 'popup';

			if ( triggeredElement.attr( 'data-class' ) ) {
				target.addClass( triggeredElement.attr( 'data-class' ) );
			}

			target.addClass( 'active' );
		}

		target.find( '.container' ).addClass( 'loading' );

		if ( jQuery( this ).data( 'title' ) ) {
			target.find( '.title' ).text( jQuery( this ).data( 'title' ) );
		}

		jQuery( this ).get_data( function( data ) {
			delete data.parent;
			delete data.target;

			for ( key in callbackData ) {
				if ( ! data[key] ) {
					data[key] = callbackData[key];
				}
			}

			window.eoxiaJS.request.send( element, data );
		});

		event.stopPropagation();
	};

	window.eoxiaJS.popup.confirm = function( event ) {
		var triggeredElement = jQuery( this );
		var cbNamespace, cbObject, cbFunc = undefined;

		if ( ! jQuery( '.popup' ).hasClass( 'no-close' ) ) {
			jQuery( '.popup' ).removeClass( 'active' );

			if ( triggeredElement.attr( 'data-cb-namespace' ) && triggeredElement.attr( 'data-cb-object' ) && triggeredElement.attr( 'data-cb-func' ) ) {
				cbNamespace = triggeredElement.attr( 'data-cb-namespace' );
				cbObject = triggeredElement.attr( 'data-cb-object' );
				cbFunc = triggeredElement.attr( 'data-cb-func' );

				// On récupères les "data" sur l'élement en tant qu'args.
				triggeredElement.get_data( function( data ) {
					window.eoxiaJS[cbNamespace][cbObject][cbFunc]( triggeredElement, event, data );
				} );
			}
		}
	};

	window.eoxiaJS.popup.stop = function( event ) {
		event.stopPropagation();
	};

	window.eoxiaJS.popup.close = function( event ) {
		if ( ! jQuery( 'body' ).hasClass( 'modal-open' ) ) {
			jQuery( '.popup:not(.no-close)' ).removeClass( 'active' );
			jQuery( '.digi-popup:not(.no-close)' ).removeClass( 'active' );
		}
	};
}

"use strict";

var regex = {
	validateEmail: function(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	},

	validateEndEmail: function( endEmail ) {
		var re = /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+(\.[a-z-A-Z0-9]+)?$/;
		return re.test( endEmail );
	}
};

if ( ! window.eoxiaJS.render ) {
	window.eoxiaJS.render = {};

	window.eoxiaJS.render.init = function() {
		window.eoxiaJS.render.event();
	};

	window.eoxiaJS.render.event = function() {};

	window.eoxiaJS.render.callRenderChanged = function() {
		var key = undefined;
		var slug = undefined;

		for ( key in window.eoxiaJS ) {
			if ( window.eoxiaJS[key].renderChanged ) {
				window.eoxiaJS[key].renderChanged();
			}

			for ( slug in window.eoxiaJS[key] ) {
				if ( window.eoxiaJS[key][slug].renderChanged ) {
					window.eoxiaJS[key][slug].renderChanged();
				}
			}
		}
	};
}

if ( ! window.eoxiaJS.request ) {
	window.eoxiaJS.request = {};

	window.eoxiaJS.request.init = function() {};

	window.eoxiaJS.request.send = function( element, data ) {
		jQuery.post( window.ajaxurl, data, function( response ) {
			element.closest( '.loading' ).removeClass( 'loading' );

			if ( response && response.success ) {
				if ( response.data.namespace && response.data.module && response.data.callback_success ) {
					window.eoxiaJS[response.data.namespace][response.data.module][response.data.callback_success]( element, response );
				} else if ( response.data.module && response.data.callback_success ) {
					window.eoxiaJS[response.data.module][response.data.callback_success]( element, response );
				}
			} else {
				if ( response.data.namespace && response.data.module && response.data.callback_error ) {
					window.eoxiaJS[response.data.namespace][response.data.module][response.data.callback_error]( element, response );
				}
			}
		}, 'json' );
	};

	window.eoxiaJS.request.get = function( url, data ) {
		jQuery.get( url, data, function( response ) {
			if ( response && response.success ) {
				if ( response.data.namespace && response.data.module && response.data.callback_success ) {
					window.eoxiaJS[response.data.namespace][response.data.module][response.data.callback_success]( response );
				}
			} else {
				if ( response.data.namespace && response.data.module && response.data.callback_error ) {
					window.eoxiaJS[response.data.namespace][response.data.module][response.data.callback_error]( response );
				}
			}
		}, 'json' );
	};

}

if ( ! window.eoxiaJS.tab ) {
	window.eoxiaJS.tab = {};

	window.eoxiaJS.tab.init = function() {
		window.eoxiaJS.tab.event();
	};

	window.eoxiaJS.tab.event = function() {
	  jQuery( document ).on( 'click', '.tab-element', window.eoxiaJS.tab.load );
	};

	window.eoxiaJS.tab.load = function( event ) {
		var tabTriggered = jQuery( this );
		var data = {};

	  event.preventDefault();
		event.stopPropagation();

		tabTriggered.closest( '.content' ).removeClass( 'active' );

		if ( ! tabTriggered.hasClass( 'no-tab' ) && tabTriggered.data( 'action' ) ) {
			jQuery( '.tab .tab-element.active' ).removeClass( 'active' );
			tabTriggered.addClass( 'active' );

			data = {
				action: 'load_tab_content',
				_wpnonce: tabTriggered.data( 'nonce' ),
				tab_to_display: tabTriggered.data( 'action' ),
				title: tabTriggered.data( 'title' ),
				element_id: tabTriggered.data( 'id' )
		  };

			jQuery( '.' + tabTriggered.data( 'target' ) ).addClass( 'loading' );

			jQuery.post( window.ajaxurl, data, function( response ) {
				jQuery( '.' + tabTriggered.data( 'target' ) ).replaceWith( response.data.template );

				window.eoxiaJS.tab.callTabChanged();
			} );

		}

	};

	window.eoxiaJS.tab.callTabChanged = function() {
		var key = undefined, slug = undefined;
		for ( key in window.eoxiaJS ) {
			for ( slug in window.eoxiaJS[key] ) {
				if ( window.eoxiaJS[key][slug].tabChanged ) {
					window.eoxiaJS[key][slug].tabChanged();
				}
			}
		}
	};
}

if ( ! window.eoxiaJS.toggle ) {
	window.eoxiaJS.toggle = {};

	window.eoxiaJS.toggle.init = function() {
		window.eoxiaJS.toggle.event();
	};

	window.eoxiaJS.toggle.event = function() {
	  jQuery( document ).on( 'click', '.toggle:not(.disabled), .toggle:not(.disabled) i', window.eoxiaJS.toggle.open );
	  jQuery( document ).on( 'click', 'body', window.eoxiaJS.toggle.close );
	};

	window.eoxiaJS.toggle.open = function( event ) {
		var target = undefined;
		var data = {};
		var i = 0;
		var listInput = undefined;
		var key = undefined;
		var elementToggle = jQuery( this );

		if ( elementToggle.is( 'i' ) ) {
			elementToggle = elementToggle.parents( '.toggle' );
		}

		jQuery( '.toggle .content.active' ).removeClass( 'active' );
		jQuery( '.toggle' ).closest( '.mask' ).removeClass( 'mask' );

		if ( elementToggle.attr( 'data-parent' ) ) {
			target = elementToggle.closest( '.' + elementToggle.attr( 'data-parent' ) ).find( '.' + elementToggle.attr( 'data-target' ) );
		} else {
			target = jQuery( '.' + elementToggle.attr( 'data-target' ) );
		}

		if ( target ) {
			target.toggleClass( 'active' );

			if ( jQuery( event.currentTarget ).hasClass( 'toggle' ) ) {
				event.stopPropagation();
			}
		}

		if ( elementToggle.attr( 'data-mask' ) ) {
			target.closest( '.' + elementToggle.attr( 'data-mask' ) ).addClass( 'mask' );
		}

		if ( elementToggle.attr( 'data-action' ) ) {
			elementToggle.addClass( 'loading' );

			listInput = window.eoxiaJS.arrayForm.getInput( elementToggle );
			for ( i = 0; i < listInput.length; i++ ) {
				if ( listInput[i].name ) {
					data[listInput[i].name] = listInput[i].value;
				}
			}

			elementToggle.get_data( function( attrData ) {
				for ( key in attrData ) {
					data[key] = attrData[key];
				}

				window.eoxiaJS.request.send( elementToggle, data );
			} );
		}
	};

	window.eoxiaJS.toggle.close = function( event ) {
		jQuery( '.toggle .content' ).removeClass( 'active' );
		jQuery( '.toggle' ).closest( '.mask' ).removeClass( 'mask' );

		event.stopPropagation();
	};
}
