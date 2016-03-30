/**
 * Presence monitor script for webstrates
 * Just include this in your webstrate: <script src="https://cdn.rawgit.com/henrikkorsgaard/webstrateUtils/master/ws-presence.js"></script>
 * This is just a presence manager - you will need to represent/style the list of ws-clients yourself.
 */

( function () {
    var timer, root, interval = ( Math.random() * 20000 ) + 10000;
    
    root = document.getElementById( 'ws-presence' );
    if ( !root ) {
        root = document.createElement( 'ws-presence' );
        root.id = 'ws-presence';
        document.body.appendChild( root );
        root.dataset.updated = new Date().getTime();
    }

    var self = document.createElement( 'ws-client' );
    self.dataset.id = generateUUID();
    self.dataset.parent = ( window.location != window.parent.location ) ? document.referrer : document.location;
    self.dataset.present = true;
    self.dataset.updated = new Date().getTime();
    root.appendChild( self );

    var present = root.getElementsByTagName( 'ws-client' );

    var updateObserver = new MutationObserver( function ( mutations ) {
        mutations.forEach( function ( mutation ) {
            if ( mutation.attributeName === 'data-updated' ) {
                clearTimeout( timer );
                console.log( 'pinging clients to update presence' );
                for ( var i = 0; i < present.length; i++ ) {
                    present[ i ].dataset.present = false;
                }
                timer = setInterval( tick, interval );
                setTimeout( function () {
                    for ( var i = 0; i < present.length; i++ ) {
                        if ( present[ i ].dataset.present === 'false' ) {
                            present[ i ].parentNode.removeChild( present[ i ] );
                        }
                    }
                }, 5000 );
            } else if ( mutation.addedNodes.length > 0 ) {
                //new clients arrive - wanna do something about it here?
            }
        } );
    } );

    var presenceObserver = new MutationObserver( function ( mutations ) {
        mutations.forEach( function ( mutation ) {
            console.log( "Present!" );
            if ( mutation.target.dataset.present === 'false' ) {
                mutation.target.dataset.present = true;
                self.dataset.updated = new Date().getTime();
            }
        } );
    } );

    updateObserver.observe( root, {
        attributes: true,
        childList: true,
        characterData: false
    } );
    presenceObserver.observe( self, {
        attributes: true,
        childList: false,
        characterData: false
    } );
    timer = setInterval( tick, interval );


    function tick() {
        root.dataset.updated = new Date().getTime();
    }

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
            var r = ( d + Math.random() * 16 ) % 16 | 0;
            d = Math.floor( d / 16 );
            return ( c == 'x' ? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
        } );
        return uuid;
    };
}() );
