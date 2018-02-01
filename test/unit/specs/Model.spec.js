import Model from 'src/model/model'

describe('Model.js', () => {
     var model;
     var myLen;   

     beforeEach(function() {
    	 model = Model.model();
    	 myLen = 0;
     });
     
     it('Ensure Model is loaded and Views are equal to 3 in length', function() { 	
    	 if( model && model.views ) {
    		 myLen = model.views.length;
    	    }
    	    expect( myLen ).to.equal( 3 );
      });
});

