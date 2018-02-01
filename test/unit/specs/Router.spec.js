import Model from 'src/model/model';
import Router from 'src/modules/router';

describe('Router.js', () => {
     var model;
     var myLen;
     var router;


     
     beforeEach(function() {
    	 window.onbeforeunload = () => 'Oh no!';
    	 model = Model.model();
    	 myLen = 0;
    	 router = Router;
    	 router.mode = 'hash'; 
     });
     

     
     it('Ensure Router Hash hashchange event works', function() { 	
    	 if( model && model.views ) {
    		 myLen = model.views.length;
    	    }
    	    var myEvt = {};
    	    myEvt.oldURL= "http://localhost";
    	    myEvt.newURL = "http://localhost/#/desktop";
    	    expect( myLen ).to.equal( 3 );
    	   // router.hashchange( 'home' );
    	    // will need to test view to make sure it set to root since this is not a valid path
    	   
    	    router.hashchange(myEvt);
    	    myEvt.newURL = "http://localhost/#/desktop?id=1234";
    	    router.hashchange( myEvt );
    	    
    	    router.appModel.currentScreen = myEvt.newURL;
    	    router.hashchange( myEvt );
    	    
    	   // window.location.hostname = "local";
    	    myEvt.newURL = "http://localhost/#/desktop?id=1234";
    	    router.hashchange( myEvt );
    	    // will need to test view to make sure it set
    	    
      });
     
     it('Ensure Router Reset Paths works', function() { 	
    	    router.resetValidPaths(); 
    	    router.validPaths.home;
    	    expect( router.validPaths.home ).to.equal( 1 );
    	    expect( router.validPaths.desktop ).to.equal( 1 );
    	    expect( router.validPaths.junk ).to.equal( undefined );
    	    expect( router.isPathValid( null) ).to.equal( false );
    	   
      });
     
     it('Ensure Router Config works', function() { 
    	var myOptions = {};
    	myOptions.root = 'http://localhost/#/desktop?id=1234';
 	    router.config(myOptions);
 	    myOptions = {};
 	    router.config( myOptions ); 
     });
     
     // need time to research why PhantomJS 2.1.1 Some of your tests did a full page reload
	 // root to issue is window.location.href with PhantomJS 2.1.1 with Karma
     // info https://github.com/karma-runner/karma/issues/1101
     it('Ensure Navigate works', function() { 	 
    	 router.mode = 'skipMode'; 
    	 router.navigate( 'home' ); 
  	     router.navigate( 'junk' ); 
  	     router.navigate( null ); 
  	     router.mode = 'junk'; 
  	     router.navigate( 'junk' );
  	     router.mode = 'hash'; 
      });
     
     it('Ensure isPathValid works', function() { 	   
   	    expect( router.isPathValid( 'home' ) ).to.equal( true );
   	    expect( router.isPathValid( 'junk' ) ).to.equal( false );
   	    expect( router.isPathValid( 'home' ) ).to.equal( true );
   	    expect( router.isPathValid( 'junk' ) ).to.equal( false );
      });
});

