(
	function( window, $ ) {
		'use strict';
		window.DotInsights = window.DotInsights || {};

		var $supports_html5_storage = true;
		try {
			$supports_html5_storage = (
				'sessionStorage' in window && window.sessionStorage !== null
			);
			window.sessionStorage.setItem( 'mg', 'test' );
			window.sessionStorage.removeItem( 'mg' );
			window.localStorage.setItem( 'mg', 'test' );
			window.localStorage.removeItem( 'mg' );
		} catch ( err ) {
			$supports_html5_storage = false;
		}

		DotInsights.StorageUtil = {
			isSupported: $supports_html5_storage,
			set: function( key, value ) {
				var settings = JSON.parse( localStorage.getItem( 'dotinsights' ) );
				settings = settings ? settings : {};

				settings[ key ] = value;

				localStorage.setItem( 'dotinsights', JSON.stringify( settings ) );
			},
			get: function( key, defaults = '' ) {
				var settings = JSON.parse( localStorage.getItem( 'dotinsights' ) );

				if ( settings && settings.hasOwnProperty( key ) ) {
					return settings[ key ];
				}

				return defaults;
			},
		};

		DotInsights.Helpers = {
			setElementHandling: ( $element ) => {
				$element.addClass( 'updating-icon' );
			},

			unsetElementHandling: ( $element ) => {
				$element.removeClass( 'updating-icon' );
			},

			isHandheld: () => {
				let check = false;
				(
					function( a ) {
						if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( a.substr( 0, 4 ) ) ) {
							check = true;
						}
					}
				)( navigator.userAgent || navigator.vendor || window.opera );
				return check;
			},

			sanitizeKey: function( key ) {
				key = key.replace( ' ', '_', key );

				return key.toLowerCase();
			},

			groupByKey: function( xs, key ) {
				return xs.reduce( function( rv, x ) {
					var _key = '' !== x[ key ] ? x[ key ] : 'others';

					(
						rv[ _key ] = rv[ _key ] || []
					).push( x );
					return rv;
				}, {} );
			},

			filterByRules: function( rules, array ) {
				var ruleLength = rules.length;

				// Convert search term for operator LIKE.
				for ( var i = 0; i < ruleLength; i ++ ) {
					if ( 'like' === rules[ i ].operator ) {
						rules[ i ].value = rules[ i ].value.toLowerCase();
					}
				}

				return array.filter( function( item ) {
					for ( var i = 0; i < ruleLength; i ++ ) {
						if ( 'like' === rules[ i ][ 'operator' ] ) {
							// Convert both side to lower case to ignore case sensitive.
							if ( ! item[ rules[ i ].key ].toLowerCase().match( rules[ i ].value ) ) {
								return false;
							}
						} else {
							if ( item[ rules[ i ].key ] !== rules[ i ].value ) {
								return false;
							}
						}
					}

					return true;
				} );
			}

		};

		DotInsights.NumberUtil = {
			formatWithCommas: function( x ) {
				return x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
			},

			getRandomInt: function( min, max ) {
				min = Math.ceil( min );
				max = Math.floor( max );
				return Math.floor( Math.random() * (
					max - min
				) + min ); // The maximum is exclusive and the minimum is inclusive
			},

			precisionRoundMod: function( number, precision ) {
				var factor = Math.pow( 10, precision ),
				    n      = precision < 0 ? number : 0.01 / factor + number;
				return Math.round( n * factor ) / factor;
			},

			checkOverlap: function( R, Xc, Yc, X1, Y1, X2, Y2 ) {

				// Find the nearest point on the
				// rectangle to the center of
				// the circle
				let Xn = Math.max( X1, Math.min( Xc, X2 ) );
				let Yn = Math.max( Y1, Math.min( Yc, Y2 ) );

				// Find the distance between the
				// nearest point and the center
				// of the circle
				// Distance between 2 points,
				// (x1, y1) & (x2, y2) in
				// 2D Euclidean space is
				// ((x1-x2)**2 + (y1-y2)**2)**0.5
				let Dx = Xn - Xc;
				let Dy = Yn - Yc;
				return (
					       Dx * Dx + Dy * Dy
				       ) <= R * R;
			},

			dist: function( x1, y1, x2, y2 ) {
				return Math.hypot( x2 - x1, y2 - y1 );
			},
		};

		DotInsights.StringUtil = {
			rtrim: function( str, char ) {
				return str.replace( new RegExp( char + "*$" ), '' );
			}
		};

		DotInsights.ArrayUtil = {
			dynamicSort: function( property ) {
				var sortOrder = 1;
				if ( property[ 0 ] === "-" ) {
					sortOrder = - 1;
					property = property.substr( 1 );
				}
				return function( a, b ) {
					/* next line works with strings and numbers,
					 * and you may want to customize it to your needs
					 */
					var result = (
						a[ property ] > b[ property ]
					) ? - 1 : (
						a[ property ] < b[ property ]
					) ? 1 : 0;
					return result * sortOrder;
				}
			}
		};
	}( window, jQuery )
);