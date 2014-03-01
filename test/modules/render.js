// RENDERING TESTS
// ===============
//
// TODO: add moar tests

define([ 'Ractive', 'samples/render' ], function ( Ractive, tests ) {

	window.Ractive = Ractive;

	return function () {

		var fixture = document.getElementById( 'qunit-fixture' ), runTest, theTest, hasSvg, i;

		module ( 'Render' );

		hasSvg = document.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1' );

		// argh IE
		if ( ![].reduce ) {
			Array.prototype.reduce = function ( reducer, start ) {
				var i, len, reduced;

				reduced = start || 0;

				len = this.length;
				for ( i=0; i<len; i+=1 ) {
					if ( this.hasOwnProperty( i ) ) {
						reduced = reducer( reduced, this[i] );
					}
				}

				return reduced;
			};
		}

		runTest = function ( i ) {
			var theTest = tests[i];

			if ( theTest.nodeOnly ) {
				return;
			}

			test( theTest.name, function ( t ) {
				[ false, true ].forEach( function ( magic ) {
					var view, data;

					data = typeof theTest.data === 'function' ? theTest.data() : deepClone( theTest.data );

					view = new Ractive({
						el: fixture,
						data: data,
						template: theTest.template,
						partials: theTest.partials,
						debug: true,
						magic: magic
					});

					t.htmlEqual( fixture.innerHTML, theTest.result );
					t.htmlEqual( view.toHTML(), theTest.result );

					if ( theTest.new_data ) {
						view.set( theTest.new_data );

						t.htmlEqual( fixture.innerHTML, theTest.new_result );
						t.htmlEqual( view.toHTML(), theTest.new_result );
					}

					view.teardown();
				});
			});
		};

		for ( i=0; i<tests.length; i+=1 ) {
			if ( !hasSvg && tests[i].svg ) {
				continue;
			}

			runTest( i );
		}

	};

	function deepClone ( source ) {
		var target, key;

		if ( !source || typeof source !== 'object' ) {
			return source;
		}

		if ( Array.isArray( source ) ) {
			return source.slice();
		}

		target = {};

		for ( key in source ) {
			if ( source.hasOwnProperty( key ) ) {
				target[ key ] = deepClone( source[ key ] );
			}
		}

		return target;
	}

});
