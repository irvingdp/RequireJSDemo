requirejs.config({
    //By default load any module IDs from js/lib  
    baseUrl: '/Scripts',
    //except, if the module ID starts with "app",  
    //load it from the js/app directory. paths  
    //config is relative to the baseUrl, and  
    //never includes a ".js" extension since  
    //the paths config could be for a directory.  
    shim: { 
        'jp_cons_srf': ['jquery-1.7.1.min']
    } ,
  
  


});

requirejs(['jp_cons_srf']);

